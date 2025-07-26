from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///bulkbite.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Models
class Vendor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    orders = db.relationship('Order', backref='vendor', lazy=True)

class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    products = db.relationship('Product', backref='supplier', lazy=True)
    reviews = db.relationship('Review', backref='supplier', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20))
    min_quantity = db.Column(db.Integer, default=1)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    target_quantity = db.Column(db.Integer, nullable=False)
    current_quantity = db.Column(db.Integer, default=0)
    price_per_unit = db.Column(db.Float, nullable=False)
    deadline = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='active')  # active, completed, expired
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('vendor.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    product = db.relationship('Product', backref='groups')
    creator = db.relationship('Vendor', backref='created_groups')
    orders = db.relationship('Order', backref='group', lazy=True)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, delivered
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendor.id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendor.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    reviewer = db.relationship('Vendor', backref='reviews_given')

# API Routes

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    user_type = data.get('user_type', 'vendor')  # vendor or supplier
    
    if user_type == 'vendor':
        user = Vendor.query.filter_by(email=email).first()
        if not user:
            # Create new vendor for demo
            user = Vendor(name=data.get('name', 'New Vendor'), email=email)
            db.session.add(user)
            db.session.commit()
    else:
        user = Supplier.query.filter_by(email=email).first()
        if not user:
            # Create new supplier for demo
            user = Supplier(name=data.get('name', 'New Supplier'), email=email)
            db.session.add(user)
            db.session.commit()
    
    return jsonify({
        'success': True,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'type': user_type
        }
    })

@app.route('/api/products', methods=['GET', 'POST'])
def products():
    if request.method == 'GET':
        supplier_id = request.args.get('supplier_id')
        if supplier_id:
            products = Product.query.filter_by(supplier_id=supplier_id).all()
        else:
            products = Product.query.all()
        
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'unit': p.unit,
            'min_quantity': p.min_quantity,
            'supplier_id': p.supplier_id,
            'supplier_name': p.supplier.name
        } for p in products])
    
    elif request.method == 'POST':
        data = request.get_json()
        product = Product(
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            unit=data.get('unit', 'piece'),
            min_quantity=data.get('min_quantity', 1),
            supplier_id=data['supplier_id']
        )
        db.session.add(product)
        db.session.commit()
        
        return jsonify({'success': True, 'id': product.id})

@app.route('/api/groups', methods=['GET', 'POST'])
def groups():
    if request.method == 'GET':
        groups = Group.query.all()
        return jsonify([{
            'id': g.id,
            'name': g.name,
            'description': g.description,
            'target_quantity': g.target_quantity,
            'current_quantity': g.current_quantity,
            'price_per_unit': g.price_per_unit,
            'deadline': g.deadline.isoformat() if g.deadline else None,
            'status': g.status,
            'product_name': g.product.name,
            'creator_name': g.creator.name
        } for g in groups])
    
    elif request.method == 'POST':
        data = request.get_json()
        group = Group(
            name=data['name'],
            description=data.get('description'),
            target_quantity=data['target_quantity'],
            price_per_unit=data['price_per_unit'],
            product_id=data['product_id'],
            created_by=data['created_by']
        )
        db.session.add(group)
        db.session.commit()
        
        return jsonify({'success': True, 'id': group.id})

@app.route('/api/orders', methods=['GET', 'POST'])
def orders():
    if request.method == 'GET':
        vendor_id = request.args.get('vendor_id')
        if vendor_id:
            orders = Order.query.filter_by(vendor_id=vendor_id).all()
        else:
            orders = Order.query.all()
        
        return jsonify([{
            'id': o.id,
            'quantity': o.quantity,
            'total_price': o.total_price,
            'status': o.status,
            'group_name': o.group.name,
            'vendor_name': o.vendor.name,
            'created_at': o.created_at.isoformat()
        } for o in orders])
    
    elif request.method == 'POST':
        data = request.get_json()
        order = Order(
            quantity=data['quantity'],
            total_price=data['total_price'],
            vendor_id=data['vendor_id'],
            group_id=data['group_id']
        )
        db.session.add(order)
        
        # Update group current quantity
        group = Group.query.get(data['group_id'])
        group.current_quantity += data['quantity']
        
        db.session.commit()
        
        return jsonify({'success': True, 'id': order.id})

@app.route('/api/suppliers', methods=['GET', 'POST'])
def suppliers():
    if request.method == 'GET':
        suppliers = Supplier.query.all()
        return jsonify([{
            'id': s.id,
            'name': s.name,
            'email': s.email,
            'location': s.location,
            'description': s.description,
            'latitude': s.latitude,
            'longitude': s.longitude
        } for s in suppliers])
    
    elif request.method == 'POST':
        # Submit review
        data = request.get_json()
        review = Review(
            rating=data['rating'],
            comment=data.get('comment'),
            vendor_id=data['vendor_id'],
            supplier_id=data['supplier_id']
        )
        db.session.add(review)
        db.session.commit()
        
        return jsonify({'success': True, 'id': review.id})

@app.route('/api/mapdata', methods=['GET'])
def mapdata():
    vendors = Vendor.query.filter(Vendor.latitude.isnot(None)).all()
    suppliers = Supplier.query.filter(Supplier.latitude.isnot(None)).all()
    
    return jsonify({
        'vendors': [{
            'id': v.id,
            'name': v.name,
            'latitude': v.latitude,
            'longitude': v.longitude,
            'type': 'vendor'
        } for v in vendors],
        'suppliers': [{
            'id': s.id,
            'name': s.name,
            'latitude': s.latitude,
            'longitude': s.longitude,
            'type': 'supplier'
        } for s in suppliers]
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
