from django.contrib import admin
from .models import MenuCategory, MenuItem , Order

# Register your models here.

admin.site.register(MenuCategory)
admin.site.register(MenuItem)

# ✅ Register Order with custom admin view
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'phone', 'total_price', 'payment_method', 'razorpay_order_id', 'order_time']
    list_filter = ['payment_method', 'order_time']
    search_fields = ['name', 'phone', 'food_items']


