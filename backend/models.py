from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), nullable=False)  # 'admin' or 'player'
    coins = db.Column(db.Float, default=50000.0)
    points_earned = db.Column(db.Integer, default=0) # New: Track points for leaderboard
    
    # Auth Fields
    email = db.Column(db.String(120), unique=True, nullable=True) 
    college_id = db.Column(db.String(50), unique=True, nullable=True) 
    password = db.Column(db.String(200), nullable=False) 
    
    # Recommendation Logic
    reco_tries_left = db.Column(db.Integer, default=2)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    base_price = db.Column(db.Float, nullable=False)
    current_price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    points = db.Column(db.Integer, nullable=False)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    price_paid = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class PriceHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
