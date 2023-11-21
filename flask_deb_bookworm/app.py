from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
db = SQLAlchemy(app)

# Define a simple model
class ExampleModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(80))

@app.before_first_request
def initialize_database():
    db.create_all()
    if not ExampleModel.query.first():
        db.session.add(ExampleModel(data="Dummy Data"))
        db.session.commit()

@app.route('/')
def index():
    data = ExampleModel.query.first()
    return jsonify({'id': data.id, 'data': data.data})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8093)

