import mysql.connector
from flask import Flask, jsonify
import os

app = Flask(__name__)

# Use a variável de ambiente DATABASE_URL
DATABASE_URL = os.getenv('DATABASE_URL', 'mysql://root:qJKZFaMxkRtYXNaagMSHDBnLZetTSGsM@viaduct.proxy.rlwy.net:11237/railway')

@app.route('/test_connection')
def test_connection():
    try:
        # Parâmetros extraídos do DATABASE_URL ou hardcoded
        connection = mysql.connector.connect(
            host="viaduct.proxy.rlwy.net",         # Substitua pelo host real
            port=11237,                            # Substitua pela porta real
            database="railway",                    # Substitua pelo nome do banco de dados real
            user="root",                           # Substitua pelo usuário real
            password="qJKZFaMxkRtYXNaagMSHDBnLZetTSGsM"  # Substitua pela senha real
        )
        connection.close()
        return "Conexão com o banco de dados bem-sucedida!", 200
    except mysql.connector.Error as err:
        return f"Erro ao conectar ao banco de dados: {err}", 500

if __name__ == "__main__":
    app.run(debug=True)
