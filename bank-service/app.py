from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)

def get_connection():
    return psycopg2.connect(
        dbname="bank_db",
        user="bank_user",
        password="bank_password",
        host="bank-db",
        port=5432
    )

@app.route("/balance/<account_number>", methods=["GET"])
def get_balance(account_number):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT solde, creation_date FROM accounts WHERE account_number = %s", (account_number,))
        result = cur.fetchone()
        cur.close()
        conn.close()

        if not result:
            return jsonify({"error": "Compte introuvable"}), 404

        return jsonify({
            "solde": float(result[0]),
            "creation_date": result[1].strftime("%Y-%m-%d %H:%M:%S")
        })
    except Exception as e:
        return jsonify({"error": f"Erreur serveur: {str(e)}"}), 500
    
@app.route("/register", methods=["POST"])
def register_account():
    data = request.get_json()
    account_number = data.get("account_number")
    solde = data.get("solde", 0)
    creation_date = data.get("creation_date")

    if not account_number or not creation_date:
        return jsonify({"error": "Informations incomplètes"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO accounts (account_number, solde, creation_date) VALUES (%s, %s, %s)",
            (account_number, solde, creation_date)
        )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Compte bancaire créé"}), 201
    except Exception as e:
        return jsonify({"error": f"Erreur serveur : {str(e)}"}), 500
    
    
@app.route("/delete", methods=["POST"])
def delete_account():
    data = request.get_json()
    account_number = data.get("account_number")

    if not account_number:
        return jsonify({"error": "Numéro de compte requis"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM accounts WHERE account_number = %s", (account_number,))
        deleted = cur.rowcount
        conn.commit()
        cur.close()
        conn.close()

        if deleted == 0:
            return jsonify({"error": "Compte bancaire introuvable"}), 404

        return jsonify({"message": "Compte bancaire supprimé avec succès."}), 200

    except Exception as e:
        return jsonify({"error": f"Erreur serveur : {str(e)}"}), 500
    
@app.route("/accounts", methods=["GET"])
def get_all_accounts():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT account_number, solde, creation_date FROM accounts")
        accounts = [
            {
                "account_number": row[0],
                "solde": float(row[1]),
                "creation_date": row[2].strftime("%Y-%m-%d %H:%M:%S")
            }
            for row in cur.fetchall()
        ]
        cur.close()
        conn.close()
        return jsonify(accounts)
    except Exception as e:
        return jsonify({"error": f"Erreur serveur : {str(e)}"}), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)