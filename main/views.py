from django.http import HttpResponse , JsonResponse
from django.shortcuts import render, redirect , get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import MenuCategory, MenuItem, Order 
from .razorpay_client import razorpay_client
from django.conf import settings
import json
import hmac
import hashlib
import razorpay


# Create your views here.

def home(request):
    return render(request, 'index.html')


def reservation(request):
    return render(request, 'reservation.html')

def contact(request):
    return render(request, 'contact.html')

def about(request):
    return render(request, 'about.html')  # 🛠️ Ensure karein ki ye exist karta ho

def order(request):
    return render(request, 'order.html')


def menu(request):
    categories = MenuCategory.objects.all()  # ✅ Ye categories fetch karega
    items = MenuItem.objects.all()  # ✅ Ye menu items fetch karega
    return render(request, 'menu.html', {'categories': categories, 'items': items})



def view_cart(request):
    cart = request.session.get('cart', {})
    total = sum(item['price'] * item['quantity'] for item in cart.values())
    print("DEBUG CART:", request.session.get('cart', {}))

    return render(request, 'cart.html', {'cart': cart, 'total': total})


def add_to_cart(request, item_id):
    cart = request.session.get('cart', {})
    
    # Debug ke liye print
    print("Before adding - Cart:", cart)
    
    item = get_object_or_404(MenuItem, id=item_id)
    item_id_str = str(item.id)

    if item_id_str in cart:
        cart[item_id_str]['quantity'] += 1
    else:
        cart[item_id_str] = {
            'name': item.name,
            'price': float(item.price),
            'quantity': 1
        }
    
    # Debug ke liye print
    print("After adding - Cart:", cart)
    
    request.session['cart'] = cart
    request.session.modified = True  # ✅ Important: Session ko save karne ke liye
    
    return redirect('menu')

def remove_from_cart(request, item_id):
    cart = request.session.get('cart', {})
    if str(item_id) in cart:
        del cart[str(item_id)]
        request.session['cart'] = cart
    return redirect('cart')


def verify_razorpay_signature(order_id, payment_id, signature):
    """
    Razorpay ke signature ko verify karta hai using secret key.
    """
    generated_signature = hmac.new(
        key=bytes(settings.RAZORPAY_SECRET, 'utf-8'),
        msg=bytes(f"{order_id}|{payment_id}", 'utf-8'),
        digestmod=hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(generated_signature, signature)


@csrf_exempt
def save_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            if data.get('payment') == "cod":
                order = Order.objects.create(
                    name=data.get('name'),
                    phone=data.get('phone'),
                    address=data.get('address'),
                    food_items=data.get('food'),
                    quantity=int(data.get('quantity')),
                    total_price=float(data.get('total_price')),
                    discount_applied=float(data.get('discount', 0)),
                    payment_method="cod"
                )
                request.session['last_order_id'] = order.id
                return JsonResponse({"success": True, "redirect": "/order/confirmation/"})
            else:
                return JsonResponse({"success": False, "error": "Use Razorpay flow for online"})

        except Exception as e:
            print("❌ COD Save Error:", e)
            return JsonResponse({"success": False, "error": "Server error (COD)"})

    return JsonResponse({"success": False, "error": "Invalid request"})


@csrf_exempt
def create_razorpay_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            razorpay_order = razorpay_client.order.create({
                "amount": int(float(data.get('total_price')) * 100),
                "currency": "INR",
                "receipt": f"order_rcptid_{data.get('phone')}",
                "payment_capture": 1
            })

            return JsonResponse({
                "success": True,
                "razorpay_order_id": razorpay_order['id'],
                "amount": int(float(data.get('total_price')) * 100),
                "name": data.get('name'),
                "phone": data.get('phone'),
                "full_data": data
            })

        except Exception as e:
            print("❌ Razorpay Order Error:", e)
            return JsonResponse({"success": False, "error": "Server error"})
    return JsonResponse({"success": False, "error": "Invalid request"})


@csrf_exempt
def verify_and_save_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            razorpay_order_id = data.get('razorpay_order_id')
            razorpay_payment_id = data.get('razorpay_payment_id')
            razorpay_signature = data.get('razorpay_signature')

            # ❗ Signature Verification
            if not verify_razorpay_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature):
                return JsonResponse({"success": False, "error": "Signature verification failed"}, status=400)

            # ✅ Signature valid, ab order save karo
            order = Order.objects.create(
                name=data.get('name'),
                phone=data.get('phone'),
                address=data.get('address'),
                food_items=data.get('food'),
                quantity=int(data.get('quantity')),
                total_price=float(data.get('total_price')),
                discount_applied=float(data.get('discount', 0)),
                payment_method="online",
                razorpay_order_id=razorpay_order_id,
                razorpay_payment_id=razorpay_payment_id
            )

            request.session['last_order_id'] = order.id
            return JsonResponse({"success": True, "redirect": "/order/confirmation/"})

        except Exception as e:
            print("❌ Save Error:", e)
            return JsonResponse({"success": False, "error": "Save failed"})

    return JsonResponse({"success": False, "error": "Invalid request"})


def order_confirmation(request):
    order_id = request.session.get("last_order_id")
    if not order_id:
        return redirect("/")

    order = get_object_or_404(Order, id=order_id)
    final_price = order.total_price - order.discount_applied

    return render(request, "order_confirmation.html", {
        "order": order,
        "final_price": final_price
    })



