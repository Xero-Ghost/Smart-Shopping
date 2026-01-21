def calculate_new_price(current_price, stock_before_purchase, quantity_bought=1):
    """
    ALWAYS INCREASE PRICE based on demand.
    Formula: NewPrice = OldPrice * (1 + (QtyBought / StockBeforePurchase))
    """
    if stock_before_purchase <= 0:
        return current_price
    
    # Strict Increase: The lower the stock, the higher the jump.
    demand_factor = quantity_bought / stock_before_purchase
    new_price = current_price * (1 + demand_factor)
    return new_price

def get_best_path(products, user_coins, steps=5):
    """
    Finds the sequence of 5 purchases that yields the Maximum Points.
    Uses DFS (Recursion) to explore paths.
    """
    
    best_path = []
    max_points = -1

    # Deep Copy or Simulation Helper
    # We represent state as: (current_coins, current_points, list_of_product_states)
    
    # Initialize Product States for simulation
    initial_product_states = {}
    for p in products:
        initial_product_states[p.id] = {
            "id": p.id,
            "name": p.name,
            "price": p.current_price,
            "stock": p.stock,
            "points": p.points
        }

    def dfs(step, current_coins, current_points, product_states, path):
        nonlocal max_points, best_path
        
        # Base Case: 5 steps reached
        if step == steps:
            if current_points > max_points:
                max_points = current_points
                best_path = list(path)
            return

        # Optimization: If can't beat max even with best possible buys, prune (simplified: skip for now)
        
        # Try buying each product
        made_purchase = False
        sorted_products = sorted(product_states.values(), key=lambda x: x['points'], reverse=True) # Heuristic: Try high points first
        
        for p_data in sorted_products:
            if p_data['stock'] > 0 and current_coins >= p_data['price']:
                made_purchase = True
                
                # Simulate Buy
                cost = p_data['price']
                points_gained = p_data['points']
                
                # New Price/Stock Logic
                new_stock = p_data['stock'] - 1
                new_price = calculate_new_price(p_data['price'], p_data['stock'], 1)
                
                # Create new state for this product
                new_p_data = p_data.copy()
                new_p_data['stock'] = new_stock
                new_p_data['price'] = new_price
                
                # Copy states map and update this product
                new_states = product_states.copy()
                new_states[p_data['id']] = new_p_data
                
                # Recurse
                new_path = path + [{
                    "step": step + 1,
                    "product_name": p_data['name'],
                    "cost": cost,
                    "points": points_gained
                }]
                
                dfs(step + 1, current_coins - cost, current_points + points_gained, new_states, new_path)
        
        # If no purchase possible (out of money/stock), stop path here
        if not made_purchase:
            if current_points > max_points:
                max_points = current_points
                best_path = list(path)
    
    dfs(0, user_coins, 0, initial_product_states, [])
    return best_path
