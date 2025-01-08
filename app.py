import mysql.connector
import os
from urllib.parse import urlparse

# Pega a URL do banco de dados da variável de ambiente
DATABASE_URL = os.getenv('DATABASE_URL', 'mysql://root:qJKZFaMxkRtYXNaagMSHDBnLZetTSGsM@viaduct.proxy.rlwy.net:11237/railway')

# Faz o parsing da URL para extrair os dados de conexão
url = urlparse(DATABASE_URL)

# Tentativa de conexão com o banco de dados
try:
    banco = mysql.connector.connect(
        host=url.hostname,
        port=url.port,
        database=url.path[1:],  # Remove o '/' inicial
        user=url.username,
        password=url.password
    )

    # Testa a execução de uma query simples
    cursor = banco.cursor()
    cursor.execute("SELECT DATABASE();")
    database_name = cursor.fetchone()
    print(f"Conexão bem-sucedida! Você está conectado ao banco de dados: {database_name[0]}")

    # Fechar a conexão
    cursor.close()
    banco.close()

except mysql.connector.Error as err:
    print(f"Erro ao conectar ao banco de dados: {err}")



