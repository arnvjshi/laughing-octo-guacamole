from app import app, db, Vendor, Supplier, Product, Group, Order, Review
from datetime import datetime, timedelta

def seed_database():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create sample vendors
        vendors = [
            Vendor(name="Street Food Corner", email="vendor1@example.com", 
                  location="Downtown Market", latitude=40.7128, longitude=-74.0060),
            Vendor(name="Quick Bites", email="vendor2@example.com", 
                  location="Food Truck Plaza", latitude=40.7589, longitude=-73.9851),
            Vendor(name="Local Eats", email="vendor3@example.com", 
                  location="Central Park Area", latitude=40.7831, longitude=-73.9712)
        ]
        
        # Create sample suppliers
        suppliers = [
            Supplier(name="Fresh Produce Co", email="supplier1@example.com", 
                    location="Wholesale District", latitude=40.7505, longitude=-73.9934,
                    description="Fresh fruits and vegetables supplier"),
            Supplier(name="Meat & More", email="supplier2@example.com", 
                    location="Industrial Area", latitude=40.7282, longitude=-74.0776,
                    description="Quality meat and protein products"),
            Supplier(name="Dairy Delights", email="supplier3@example.com", 
                    location="Warehouse Zone", latitude=40.6892, longitude=-74.0445,
                    description="Fresh dairy products and beverages")
        ]
        
        # Add to database
        for vendor in vendors:
            db.session.add(vendor)
        for supplier in suppliers:
            db.session.add(supplier)
        
        db.session.commit()
        
        # Create sample products
        products = [
            Product(name="Fresh Tomatoes", description="Organic red tomatoes", 
                   price=2.50, unit="kg", min_quantity=5, supplier_id=1),
            Product(name="Ground Beef", description="Premium ground beef", 
                   price=8.99, unit="kg", min_quantity=2, supplier_id=2),
            Product(name="Whole Milk", description="Fresh whole milk", 
                   price=3.25, unit="liter", min_quantity=10, supplier_id=3),
            Product(name="Bell Peppers", description="Mixed color bell peppers", 
                   price=4.00, unit="kg", min_quantity=3, supplier_id=1),
            Product(name="Chicken Breast", description="Boneless chicken breast", 
                   price=12.99, unit="kg", min_quantity=2, supplier_id=2)
        ]
        
        for product in products:
            db.session.add(product)
        
        db.session.commit()
        
        # Create sample groups
        groups = [
            Group(name="Tomato Bulk Buy", description="Group buy for fresh tomatoes", 
                 target_quantity=50, current_quantity=15, price_per_unit=2.25, 
                 deadline=datetime.utcnow() + timedelta(days=3),
                 product_id=1, created_by=1),
            Group(name="Meat Monday", description="Weekly meat group purchase", 
                 target_quantity=20, current_quantity=8, price_per_unit=8.50, 
                 deadline=datetime.utcnow() + timedelta(days=1),
                 product_id=2, created_by=2),
            Group(name="Dairy Collective", description="Bulk dairy products", 
                 target_quantity=100, current_quantity=45, price_per_unit=3.00, 
                 deadline=datetime.utcnow() + timedelta(days=2),
                 product_id=3, created_by=3)
        ]
        
        for group in groups:
            db.session.add(group)
        
        db.session.commit()
        
        # Create sample orders
        orders = [
            Order(quantity=5, total_price=11.25, vendor_id=1, group_id=1),
            Order(quantity=3, total_price=25.50, vendor_id=2, group_id=2),
            Order(quantity=15, total_price=45.00, vendor_id=3, group_id=3),
            Order(quantity=10, total_price=22.50, vendor_id=1, group_id=1)
        ]
        
        for order in orders:
            db.session.add(order)
        
        db.session.commit()
        
        # Create sample reviews
        reviews = [
            Review(rating=5, comment="Excellent quality products!", vendor_id=1, supplier_id=1),
            Review(rating=4, comment="Good service, fast delivery", vendor_id=2, supplier_id=2),
            Review(rating=5, comment="Always fresh and reliable", vendor_id=3, supplier_id=3)
        ]
        
        for review in reviews:
            db.session.add(review)
        
        db.session.commit()
        
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
