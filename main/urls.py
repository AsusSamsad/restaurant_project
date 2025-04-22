from django.urls import path
from . import views # 👈 main app ke views import karein

urlpatterns = [
    path('', views.home, name='home'),
    path('menu/', views.menu, name='menu'),
    path('reservation/', views.reservation, name='reservation'),
    path('contact/', views.contact, name='contact'),
    path('about/', views.about, name='about'),
    path('order/', views.order, name='order'),
    path('cart/', views.view_cart, name='cart'),
    path('add-to-cart/<int:item_id>/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'), 
    path("save-order/", views.save_order, name="save_order"),
    path('order/confirmation/', views.order_confirmation, name='order_confirmation'),

      # ✅ Razorpay integration routes (add below 👇)
    path("create-razorpay-order/", views.create_razorpay_order, name="create_razorpay_order"),
    path("verify-and-save-order/", views.verify_and_save_order, name="verify_and_save_order"),
]
