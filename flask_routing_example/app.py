from flask import Flask, Blueprint

app = Flask(__name__)

# Create a Blueprint for route1
route1_blueprint = Blueprint('route1', __name__, url_prefix='/route1')

# Define a sub-route for route1
@route1_blueprint.route('/bob')
def route1_bob():
    return 'Welcome to /route1/bob!'

# Define another sub-route for route1
@route1_blueprint.route('/hello')
def route1_hello():
    return 'Welcome to /route1/hello!'

# Register the Blueprint for route1
app.register_blueprint(route1_blueprint)

# Create a Blueprint for route2
route2_blueprint = Blueprint('route2', __name__, url_prefix='/route2')

# Define a sub-route for route2
@route2_blueprint.route('/donkey')
def route2_donkey():
    return 'Welcome to /route2/donkey!'

# Register the Blueprint for route2
app.register_blueprint(route2_blueprint)

# Define the root route
@app.route('/')
def index():
    return 'Welcome to the root (/)!'

if __name__ == '__main__':
    app.run(debug=True)
