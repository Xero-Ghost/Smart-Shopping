import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Product, Transaction, PriceHistory
from logic import calculate_new_price, get_best_path
from datetime import datetime

app = Flask(__name__)
os.makedirs(os.path.join(app.root_path, 'instance'), exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///smartshop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db.init_app(app)

def seed_database():
    db.create_all()
    if not User.query.filter_by(role='admin').first():
        admin = User(role='admin', email='admin@smartshop.com', password='adminpassword', coins=999999)
        db.session.add(admin)
    
    initial_products = [
        {"name": "iPhone 15 Pro", "desc": "Titanium design.", "img": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80", "price": 80000.0, "stock": 5, "points": 500},
        {"name": "Samsung S24 Ultra", "desc": "Galaxy AI.", "img": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80", "price": 75000.0, "stock": 6, "points": 450},
        {"name": "Servo Motor", "desc": "High Torque.", "img": "https://images.unsplash.com/photo-1581092160562-40aa52a78671?auto=format&fit=crop&w=800&q=80", "price": 1200.0, "stock": 50, "points": 10},
        {"name": "DSA Book", "desc": "Cormen Algorithms.", "img": "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80", "price": 4000.0, "stock": 20, "points": 30},
        {"name": "Apple (Fruit)", "desc": "Fresh Red.", "img": "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80", "price": 200.0, "stock": 100, "points": 2}
    ]

    for p_data in initial_products:
        if not Product.query.filter_by(name=p_data['name']).first():
            prod = Product(
                name=p_data['name'],
                description=p_data['desc'],
                image_url=p_data['img'],
                base_price=p_data['price'],
                current_price=p_data['price'],
                stock=p_data['stock'],
                points=p_data['points']
            )
            db.session.add(prod)
            db.session.commit()
            hist = PriceHistory(product_id=prod.id, price=prod.current_price)
            db.session.add(hist)
    db.session.commit()

with app.app_context():
    # Attempt to auto-update schema by recreating if needed (simplified for prototype)
    try:
        User.query.filter_by(points_earned=0).first()
    except:
        print("Schema mismatch, rebuilding...")
        db.drop_all()
        seed_database()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    role = data.get('role', 'player')
    
    if role == 'admin':
        user = User.query.filter_by(role='admin', email=data.get('email')).first()
        if user and user.password == data.get('password'):
            return jsonify(user_to_dict(user))
    else:
        # Player
        college_id = data.get('collegeId')
        user = User.query.filter_by(college_id=college_id).first()
        if user:
            if user.password == data.get('password'):
                return jsonify(user_to_dict(user))
        else:
            user = User(role='player', college_id=college_id, password=data.get('password'))
            db.session.add(user)
            db.session.commit()
            return jsonify(user_to_dict(user))
            
    return jsonify({"error": "Invalid Credentials"}), 401

def user_to_dict(user):
    return {
        "id": user.id, 
        "username": user.college_id if user.role == 'player' else user.email, 
        "role": user.role, 
        "coins": user.coins,
        "points": user.points_earned,
        "reco_tries": user.reco_tries_left
    }

@app.route('/api/products', methods=['GET'])
def products():
    products = Product.query.all()
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "image": p.image_url,
        "price": p.current_price,
        "basePrice": p.base_price,
        "stock": p.stock,
        "points": p.points
    } for p in products])

@app.route('/api/product/<int:product_id>/history', methods=['GET'])
def product_history(product_id):
    history = PriceHistory.query.filter_by(product_id=product_id).order_by(PriceHistory.timestamp).all()
    return jsonify([{
        "price": h.price,
        "time": h.timestamp.strftime('%H:%M:%S')
    } for h in history])

@app.route('/api/buy', methods=['POST'])
def buy():
    data = request.json
    user = User.query.get(data.get('userId'))
    product = Product.query.get(data.get('productId'))
    
    if not user or not product or product.stock <= 0 or user.coins < product.current_price:
        return jsonify({"error": "Cannot purchase"}), 400
    
    # Update Stats
    user.coins -= product.current_price
    user.points_earned += product.points
    
    # Update Price (Strict Increase)
    new_price = calculate_new_price(product.current_price, product.stock, 1)
    product.stock -= 1
    product.current_price = new_price
    
    trans = Transaction(user_id=user.id, product_id=product.id, price_paid=product.current_price)
    hist = PriceHistory(product_id=product.id, price=new_price)
    
    db.session.add(user)
    db.session.add(product)
    db.session.add(trans)
    db.session.add(hist)
    db.session.commit()
    
    return jsonify({
        "message": "Success",
        "new_coins": user.coins,
        "new_points": user.points_earned // 1 # Return integer points
    })

@app.route('/api/recommendations', methods=['POST'])
def recommendations():
    data = request.json
    user = User.query.get(data.get('userId'))
    
    if not user or user.reco_tries_left <= 0:
        return jsonify({"error": "No tries left"}), 403
        
    user.reco_tries_left -= 1
    db.session.commit()
    
    products = Product.query.filter(Product.stock > 0).all()
    path = get_best_path(products, user.coins)
    
    return jsonify({
        "plan": path,
        "tries_left": user.reco_tries_left
    })

@app.route('/api/stats', methods=['GET'])
def stats():
    # Rank by POINTS now
    users = User.query.filter_by(role='player').order_by(User.points_earned.desc()).all()
    return jsonify({
        "leaderboard": [{"username": u.college_id, "coins": u.coins, "points": u.points_earned} for u in users]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
