from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import time
import os
import psycopg2

app = Flask(__name__)
CORS(app)

JWT_SECRET = os.getenv("JWT_SECRET", "clé_secrète_complexe_à_changer_en_prod")

# Connexion PostgreSQL
def get_connection():
    return psycopg2.connect(
        dbname="auth_db",
        user="auth_user",
        password="auth_password",
        host="auth-db",
        port=5432
    )

# LOGIN
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    pseudo = data.get('pseudo', '')
    password = data.get('password', '')
    
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT pseudo, password, account_number, profile_image FROM users WHERE pseudo = %s", (pseudo,))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if not user or user[1] != password:
            time.sleep(0.5)  # Protection timing
            return jsonify({"error": "Identifiants invalides"}), 401

        token = jwt.encode({
            "sub": str(user[2]),
            "pseudo": user[0],
            "exp": int(time.time()) + 3600
        }, JWT_SECRET, algorithm="HS256")

        return jsonify({
            "token": token,
            "pseudo": user[0],
            "account_number": user[2],
            "profile_image": user[3]
        })

    except Exception as e:
        app.logger.error(f"[LOGIN] Erreur : {str(e)}")
        return jsonify({"error": "Erreur serveur"}), 500

# REGISTER
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    pseudo = data.get("pseudo")
    password = data.get("password")

    if not pseudo or not password:
        return jsonify({"error": "Pseudo et mot de passe requis"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()

        # Vérifier si utilisateur existe
        cur.execute("SELECT 1 FROM users WHERE pseudo = %s", (pseudo,))
        if cur.fetchone():
            return jsonify({"error": "Pseudo déjà utilisé"}), 400

        # Générer un numéro de compte
        cur.execute("SELECT COUNT(*) FROM users")
        count = cur.fetchone()[0]
        account_number = str(1000000000 + count)

        profile_image = "default.jpg"
        cur.execute(
            "INSERT INTO users (pseudo, password, account_number, profile_image) VALUES (%s, %s, %s, %s)",
            (pseudo, password, account_number, profile_image)
        )

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Inscription réussie", "account_number": account_number}), 201

    except Exception as e:
        app.logger.error(f"[REGISTER] Erreur : {str(e)}")
        return jsonify({"error": "Erreur serveur"}), 500

# DELETE USER
@app.route("/delete", methods=["POST"])
def delete_user():
    data = request.get_json()
    pseudo = data.get("pseudo")

    if not pseudo:
        return jsonify({"error": "Pseudo requis"}), 400

    if pseudo.lower() == "admin":
        return jsonify({"error": "Impossible de supprimer le compte admin"}), 403

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM users WHERE pseudo = %s", (pseudo,))
        deleted = cur.rowcount
        conn.commit()
        cur.close()
        conn.close()

        if deleted == 0:
            return jsonify({"error": "Utilisateur introuvable"}), 404

        return jsonify({"message": f"Utilisateur {pseudo} supprimé"}), 200

    except Exception as e:
        app.logger.error(f"[DELETE] Erreur : {str(e)}")
        return jsonify({"error": "Erreur serveur"}), 500

# GET ALL USERS
@app.route("/users", methods=["GET"])
def get_all_users():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT pseudo, account_number, profile_image FROM users")
        users = [
            {"pseudo": row[0], "account_number": row[1], "profile_image": row[2]}
            for row in cur.fetchall()
        ]
        cur.close()
        conn.close()
        return jsonify(users)

    except Exception as e:
        app.logger.error(f"[GET USERS] Erreur : {str(e)}")
        return jsonify({"error": "Erreur serveur"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)