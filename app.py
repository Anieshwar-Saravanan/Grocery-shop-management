from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, init_db, Customer,Shop ,Admin ,Product ,Cart ,Review # Import Customer for testing
from config import Config
from sqlalchemy import text
from datetime import datetime
import json


# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Load configuration
app.config.from_object(Config)

# Initialize the database
init_db(app)

def create_stored_procedure():
    try:
        # Creating stored procedure for order and order_items insertion
        db.session.execute(text('''
        CREATE OR REPLACE FUNCTION insert_orders_2(
    customer_id INTEGER,
    shop_id INTEGER,
    total_amount NUMERIC,
    total_items INTEGER
)
RETURNS VOID AS $$
BEGIN
    -- Insert the order into the orders table
    INSERT INTO orders_2 (customer_id, shop_id, order_date,total_items, total_amount, status)
    VALUES (customer_id, shop_id, NOW(),total_items, total_amount, 'pending');
    
    -- Optionally, return a message or log for debugging purposes
    RAISE NOTICE 'Order placed for customer_id: %, shop_id: %, total_amount: %, total_items: %', customer_id, shop_id, total_amount, total_items;
    
    -- No explicit return since the return type is VOID
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_order_items(
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            price NUMERIC
        )
        RETURNS VOID AS $$
        BEGIN
            -- Insert the order item into the order_items table
            INSERT INTO order_items_1 (order_id, product_id, quantity, price)
            VALUES (order_id, product_id, quantity, price);
            
            -- Optionally, return a message or log for debugging purposes
            RAISE NOTICE 'Inserted item into order_items: order_id=%, product_id=%, quantity=%, price=%', 
                order_id, product_id, quantity, price;
        END;
        $$ LANGUAGE plpgsql;
                                
CREATE OR REPLACE FUNCTION update_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products_1
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
                                                          
                                
CREATE TRIGGER update_stock
AFTER INSERT ON order_items_1
FOR EACH ROW
EXECUTE FUNCTION update_stock();
                                      

-- Create the Trigger Function
CREATE OR REPLACE FUNCTION restore_stock_after_order_cancel_fn()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products_1
    SET stock_quantity = stock_quantity + OLD.quantity
    WHERE product_id = OLD.product_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create the Trigger
CREATE TRIGGER restore_stock_after_order_cancel
AFTER DELETE ON order_items_1
FOR EACH ROW
EXECUTE FUNCTION restore_stock_after_order_cancel_fn();


        '''
        ))
        
        db.session.commit()
        print("Stored procedure created successfully.")
    except Exception as e:
        db.session.rollback()
        print(f"Error creating stored procedure: {str(e)}")
with app.app_context():
    create_stored_procedure()
# ------------------ API Endpoints ------------------

# Endpoint to insert a new customer
@app.route('/api/customers', methods=['POST'])
def add_customer():
    data = request.get_json()

    # Log incoming data for debugging
    print("Incoming data:", data)

    # Check for required fields
    if not data or not all(key in data for key in ['name', 'email', 'address', 'phone', 'password']):
        return jsonify({"error": "Missing required fields"}), 400

    # Create a new customer instance
    new_customer = Customer(
        name=data['name'],
        email=data['email'],
        address=data['address'],
        phone_number=data['phone'],
        password=data['password'],
    )
    # a = db.session.execute(text("SELECT * FROM customers_5"))
    # results = a.fetchall()
    # print("Query results:", results)

    try:
        db.session.execute(text('INSERT INTO customers_4 (name, email, address, phone_number, password) VALUES (:name, :email, :address, :phone, :password)'),
        {
        'name': data['name'],
        'email': data['email'],
        'address': data['address'],
        'phone': data['phone'],
        'password': data['password'],
        })

        db.session.commit()
        return jsonify({"message": "Customer added successfully", "id": new_customer.customer_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/api/admins', methods=['POST'])
def add_admin():
    data = request.get_json()

    # Log incoming data for debugging
    print("Incoming data:", data)

    # Check for required fields
    if not data or not all(key in data for key in ['name', 'email', 'phone', 'password']):
        return jsonify({"error": "Missing required fields"}), 400

    # Create a new Admin instance
    new_admin = Admin(
        name=data['name'],
        email=data['email'],
        password=data['password'],
        phone_number=data['phone']
    )

    try:
        db.session.add(new_admin)
        db.session.commit()
        return jsonify({"message": "Admin added successfully", "id": new_admin.admin_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    
@app.route('/api/shops', methods=['POST'])
def add_shop():
    try:
        data = request.json
        admin_name = data['name']
        print("Incoming data : ",data)
        # Fetch admin_id based on admin_name
        admin = Admin.query.filter_by(name = admin_name).first()
        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        new_shop = Shop(
            admin_id=admin.admin_id,  # Use fetched admin_id
            shop_name=data['shop_name'],
            shop_address=data['shop_address'],
            phone_number=data['shop_phone_number'],
            email=data['shop_email'],
            owner_name=data['name']
        )
        db.session.add(new_shop)
        db.session.commit()
        return jsonify({"message": "Shop created successfully", "shop_id": new_shop.shop_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()

    # Log incoming data for debugging
    print("Incoming data:", data)

    s = db.session.execute(text('SELECT shop_id FROM shops_1 WHERE shop_name = :shop_name'),{
        'shop_name' : data['shopName']
    }).fetchone()
    if not s:
        return jsonify({"error": "Shop not found"}), 404

    # Check for required fields
    if not data or not all(key in data for key in ['name', 'price', 'adminName', 'stock']):
        return jsonify({"error": "Missing required fields"}), 400

    # Verify if admin_name exists in the Admin table
    admin = Admin.query.filter_by(name=data['adminName']).first()
    if not admin:
        return jsonify({"error": "Admin not found"}), 404
    # print("Admin ID is",admin.admin_id)
    # print(datetime.now())
    try:
        # Insert the product using SQLAlchemy
        db.session.execute(
            text('INSERT INTO products_1 (name, description, shop_id, price, stock_quantity, admin_id, added_date) VALUES (:name, :description, :shop_id, :price, :stock_quantity, :admin_id, :added_date)'),
            {
                'name': data['name'],
                'description': data['description'],
                'shop_id': s.shop_id,  # Use the shop_id passed in the request
                'price': data['price'],
                'stock_quantity': data['stock'],  # Correct stock quantity
                'admin_id': admin.admin_id,  # Use the admin_id of the found admin
                'added_date': datetime.now()
            }
        )   

        db.session.commit()
        return jsonify({"message": "Product added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route('/api/product_display',methods = ['GET'])
def get_products():
    try:
        query = """DO $$
DECLARE
    product_cursor CURSOR FOR
    SELECT product_id, name, description, price, stock_quantity FROM products_1;
    product_record RECORD;
BEGIN
    -- Open and loop through the cursor
    FOR product_record IN product_cursor LOOP
        RAISE NOTICE 'Product ID: %, Name: %, Description: %, Price: %, Stock: %',
            product_record.product_id,
            product_record.name,
            product_record.description,
            product_record.price,
            product_record.stock_quantity;
    END LOOP;
END;
$$;
"""
        product = db.session.execute(text(query))
        products = db.session.execute(text("SELECT product_id,name,description,price,stock_quantity FROM products_1"))
        products_list = [{
            'product_id':product.product_id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price),
            'stock_quantity': product.stock_quantity,
        } for product in products]
        return jsonify({
            'products': products_list
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    print("Incoming data: ", data)

    # Fetch the product by name from the request
    product = db.session.execute(
        text("SELECT * FROM products_1 WHERE name = :name"),
        {'name': data['product_name']}
    ).fetchone()
    
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    product_id = product.product_id  # Extract product_id from the result
    data['product_id'] = product_id  # Add product_id to the data dictionary

    print("Product ID fetched: ", product_id)
    # Fetch the customer by customer_id from the request (assuming customer_id is sent with the request)
    customer = db.session.execute(text("SELECT * FROM customers_4 WHERE customer_id = :customer_id"), {'customer_id': data['customer_id']}).fetchone()
    print(data['customer_id'])
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    # Check if the product is already in the cart for the customer
    existing_cart_item = db.session.execute(
        text("SELECT * FROM cart_3 WHERE product_id = :product_id AND customer_id = :customer_id"),
        {'product_id': data['product_id'], 'customer_id': data['customer_id']}
    ).fetchone()
    print(existing_cart_item)
    if existing_cart_item:
        pass
        #If the product is already in the cart, update the quantity and totals
        new_quantity = existing_cart_item.quantity + int(data['quantity'])
        new_total_price = int(product.price) * new_quantity
        new_subtotal = int(product.price) * new_quantity

        db.session.execute(
            text("UPDATE cart_3 SET quantity = :quantity, total_price = :total_price, subtotal = :subtotal WHERE cart_id = :cart_id"),
            {'quantity': new_quantity, 'total_price': new_total_price, 'subtotal': new_subtotal, 'cart_id': existing_cart_item.cart_id}
        )
        db.session.commit()
        return jsonify({"message": "Product added to cart successfully","data":data}), 201
    
    else:
        #If the product is not in the cart, add a new item
        new_cart_item = Cart(
            customer_id=data['customer_id'],
            total_items=data['total_items'],
            total_price=data['total_price'],
            quantity=data['quantity'],
            product_id=data['product_id'],
            subtotal=data['subtotal']
        )
        try:
            
            db.session.execute(text('INSERT INTO cart_3 (customer_id,total_items,total_price,quantity,product_id,subtotal) VALUES (:customer_id,:total_items,:total_price,:quantity,:product_id,:subtotal)'),
                {
                    'customer_id':data['customer_id'],
                    'total_items':data['total_items'],
                    'total_price':data['total_price'],
                    'quantity':data['quantity'],
                    'product_id':data['product_id'],
                    'subtotal':data['subtotal']
                }
            )
            db.session.commit()
            return jsonify({"message": "Product added to cart successfully","data":data}), 201
    
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

@app.route('/api/cart_display', methods=['GET'])
def get_cart():
    try:
        # Fetch the cart items
        carts = db.session.execute(text("SELECT product_id, quantity, total_price FROM cart_3")).fetchall()

        # Create a list to hold product details combined with cart data
        carts_list = []

        for cart in carts:
            # Fetch product name based on the product_id in the cart
            product = db.session.execute(
                text("SELECT name FROM products_1 WHERE product_id = :product_id"),
                {'product_id': cart.product_id}
            ).fetchone()

            if product:
                carts_list.append({
                    'product_name': product.name,
                    'quantity': cart.quantity,
                    'total_price': float(cart.total_price)
                })

        return jsonify({
            'products': carts_list
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/delete_cart', methods=['POST'])
def remove_cart():
    # Access request.json without parentheses
    data = request.json
    print("Incoming data:", data)

    try:
        # Fetch the product_id using the provided product_name
        product_id = db.session.execute(
            text('SELECT product_id FROM products_1 WHERE name = :name'),
            {'name': data['product_name']}
        ).fetchone()

        if product_id is None:
            return jsonify({"error": "Product not found"}), 404

        # Delete the product from the cart
        db.session.execute(
            text('DELETE FROM cart_3 WHERE product_id = :product_id'),
            {'product_id': product_id.product_id}
        )
        db.session.commit()

        return jsonify({"message": "Product deleted from cart successfully", "data": data}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/delete_product', methods=['POST'])
def remove_product():
    # Access request.json without parentheses
    data = request.json
    print("Incoming data:", data)

    try:
        # Fetch the product_id using the provided product_name
        product_id = db.session.execute(
            text('SELECT product_id FROM products_1 WHERE name = :name'),
            {'name': data['product_name']}
        ).fetchone()

        if product_id is None:
            return jsonify({"error": "Product not found"}), 404

        # Delete the product from the cart
        db.session.execute(
            text('DELETE FROM products_1 WHERE product_id = :product_id'),
            {'product_id': product_id.product_id}
        )
        db.session.commit()

        return jsonify({"message": "Product deleted "}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500 


@app.route('/api/add_review', methods=['POST'])
def add_review():
    data = request.json
    print("Incoming data:", data)

    # Validate input data
    required_fields = ['customer_id', 'product_id', 'shop_id', 'rating', 'comment']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"'{field}' is required"}), 400

    # Additional validation (e.g., rating range)
    try:
        rating = int(data['rating'])
        if rating < 1 or rating > 5:
            return jsonify({"error": "'rating' must be between 1 and 5"}), 400
    except ValueError:
        return jsonify({"error": "'rating' must be an integer"}), 400

    try:
        # Execute the raw SQL query to insert the new review
        db.session.execute(
            text('''
                INSERT INTO reviews_1 (customer_id, product_id, shop_id, rating, comment, review_date)
                VALUES (:customer_id, :product_id, :shop_id, :rating, :comment, :review_date)
            '''),
            {
                'customer_id': data['customer_id'],
                'product_id': data['product_id'],
                'shop_id': data['shop_id'],
                'rating': data['rating'],
                'comment': data['comment'],
                'review_date': datetime.now()
            }
        )
        db.session.commit()
        return jsonify({"message": "Review added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error adding review: {e}")  # You can replace this with a logging system
        return jsonify({"error": f"Failed to add review: {str(e)}"}), 500

@app.route('/api/get_reviews', methods=['GET'])
def get_review():
    try:
        # Fetch the cart items
        reviews = db.session.execute(text("SELECT rating, comment, review_date FROM reviews_1")).fetchall()

        # Create a list to hold product details combined with cart data
        review_list = []

        # Iterate over the reviews and append each one to the review_list
        for review in reviews:
            review_list.append({
                'rating': review.rating,
                'comment': review.comment,
                'review_date': review.review_date
            })

        return jsonify({
            'products': review_list
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.get_json()
    print("Incoming data:", data)
    
    customer_id = data['customer_id']
    shop_id = data['shop_id']
    total_amount = data['total_amount']
    total_items = data['total_items']
    cart_items = data['cart_items']  # Assuming the cart items are passed in the request
    
    if not all([customer_id, shop_id, total_amount, total_items, cart_items]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Call the stored procedure to insert the order
        result = db.session.execute(
            text('''SELECT insert_orders_2(:customer_id, :shop_id, :total_amount, :total_items)'''),
            {
                'customer_id': customer_id,
                'shop_id': shop_id,
                'total_amount': total_amount,
                'total_items': total_items
            }
        )
        db.session.commit()

        # Get the order_id of the newly created order (assuming the order ID is automatically generated)
        order_id = db.session.execute(
            text('''SELECT lastval()''')  # PostgreSQL function to get the last inserted ID
        ).fetchone()[0]
        print(order_id)
        # Insert order items into the order_items table
        for item in cart_items:
            db.session.execute(
                text('''SELECT insert_order_items(:order_id, :product_id, :quantity, :price)'''),
                {
                    'order_id': order_id,
                    'product_id': 1,
                    'quantity': item['quantity'],
                    'price': item['price']
                }
            )

        db.session.commit()
        return jsonify({"message": "Order placed successfully", "order_id": order_id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to place order: {str(e)}"}), 500

    

#run the app
if __name__ == '__main__':
    app.run(debug=True)
