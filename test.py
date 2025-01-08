import mysql.connector
from flask import Flask, render_template, request, jsonify, flash
import os

DATABASE_URL = os.getenv('mysql://root:qJKZFaMxkRtYXNaagMSHDBnLZetTSGsM@viaduct.proxy.rlwy.net:11237/railway')

try:
    connection = mysql.connector.connect(
        host="viaduct.proxy.rlwy.net",         # Substitua por 'MYSQLHOST' real
        port=11237,         # Substitua por 'MYSQLPORT' real
        database="railway", # Substitua por 'MYSQLDATABASE' real
        user="root",         # Substitua por 'MYSQLUSER' real
        password="qJKZFaMxkRtYXNaagMSHDBnLZetTSGsM"
    )
    connection.close()
    return "Conexão com o banco de dados bem-sucedida!", 200
except mysql.connector.Error as err:
    return f"Erro ao conectar ao banco de dados: {err}", 500
