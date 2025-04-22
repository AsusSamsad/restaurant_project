from django.db import models

# Create your models here.

# 🥗 1. Menu Category Model
class MenuCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
    
# 🍕 2. Menu Item Model
class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='menu_images/', blank=True, null=True) # Optional Image

    def __str__(self):
        return self.name
    

class Order(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    food_items = models.TextField(max_length=255)
    quantity = models.IntegerField()
    total_price = models.FloatField()
    discount_applied = models.FloatField(default=0)
    payment_method = models.CharField(max_length=20)
    order_time = models.DateTimeField(auto_now_add=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True) 

    def __str__(self):
        return f"Order #{self.id} - {self.name}"
    
