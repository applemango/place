import os,json
from flask import Flask,jsonify,request
from datetime import datetime, timedelta, timezone
from sqlalchemy import func
from flask_jwt_extended import get_current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required,JWTManager \
    ,get_jwt,get_jwt_identity,current_user,create_refresh_token

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    ,SQLALCHEMY_TRACK_MODIFICATIONS = False
    ,SECRET_KEY = "secret"
    ,JWT_SECRET_KEY = "secret"
    ,JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=3)
    ,JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    ,JWT_TOKEN_LOCATION = "headers"
    ,JSON_AS_ASCII = False
)
cors = CORS(app, responses={r"/*": {"origins": "*"}})
db = SQLAlchemy(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

#class Canvas_data(db.Model):
#    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#    data = db.Column(db.string)
#    def __init__(self):
#        self.data = ["#fff" for i in range(32*32)]

data = ["#fff" for i in range(32*32)]

@app.route("/get/data", methods=["GET"])
@cross_origin()
def get_data():
    #C = Canvas_data.get(1)
    return jsonify({"data":data})

socketIo = SocketIO(app, cors_allowed_origins="*")
@socketIo.on("json")
def get_json(json):
    #print(json["position"])
    #C = Canvas_data.get(1)
    data[json["position"]] = json["color"]
    send(json, json=True, broadcast=True)
    #send(msg, broadcast=True)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)