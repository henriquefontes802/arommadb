import mysql.connector
from flask import Flask, render_template, request, jsonify, flash
import os

####APRIMORAR A EXCLUSÃO DE PRODUTO COM JS, PARA ELE SAIR TA TABELA NA MESMA TELA E APARECER MENSAGEM DE CONFIRMAÇÃO####

#DATABASE_URL = os.getenv('mysql://root:qJKZFaMxkRtYXNaagMSHDBnLZetTSGsM@viaduct.proxy.rlwy.net:11237/railway')

#conecta banco de dados
banco=mysql.connector.connect(
    host="viaduct.proxy.rlwy.net",         # Substitua por 'MYSQLHOST' real
    port=11237,         # Substitua por 'MYSQLPORT' real
    database="railway", # Substitua por 'MYSQLDATABASE' real
    user="root",         # Substitua por 'MYSQLUSER' real
    password="qJKZFaMxkRtYXNaagMSHDBnLZetTSGsM"
)

cursor = banco.cursor()
app = Flask(__name__)
app.secret_key = 'chave#secreta#aromma#123HJ'

@app.route("/")
def loginpage():
    return render_template("loginpage.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/produtos/disponiveis", methods=["GET"])
def produtos_disponiveis():
    try:
        # Query para obter os produtos com estoque > 0
        cursor.execute("SELECT prod_nome FROM produtos")
        produtos = cursor.fetchall()
        
        # Formatar os dados como JSON
        resultado = [{"nome": produto[0]} for produto in produtos]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route('/produtos')
def consultar_produtos():

    sql_consulta_prod = "SELECT * FROM produtos"

    cursor.execute(sql_consulta_prod)

    resultado = cursor.fetchall()

    return render_template("consultar_produtos.html", produtos=resultado)

@app.route('/produtos/cadastrar', methods=['POST'])
def cadastrar_prod():
    # Verifica se o request é JSON
    if request.is_json:
        data = request.get_json()
        prod_nome_py = data.get('prod_nome')  # Pega o nome enviado no JSON
        prod_qtd_py = data.get('prod_qtd')
        prod_vlr_py = data.get('prod_valor')

        # Busca o último ID no banco de dados
        cursor.execute("SELECT MAX(prod_id) FROM produtos")
        cod_prod = cursor.fetchone()

        if cod_prod[0] is None:
            prod_id_py = 1
        else:
            prod_id_py = cod_prod[0] + 1

        # Insere o produto no banco de dados
        sql_insert = "INSERT INTO produtos (prod_id, prod_nome, prod_qtd, prod_valor) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql_insert, (prod_id_py, prod_nome_py, prod_qtd_py, prod_vlr_py))
        banco.commit()

        # Retorna uma resposta de sucesso
        return jsonify({"message": f"Produto cadastrado: {prod_nome_py}"}), 200

    else:
        # Caso o request não seja JSON, retorna erro
        return jsonify({"error": "Formato de dados inválido, esperado JSON"}), 400

@app.route('/produtos/alterar', methods=['POST'])
def alterar_prod():

    # Receber os dados enviados do frontend
    data = request.get_json()
    produto_id = data.get('id')
    novo_nome = data.get('novo_nome')
    novo_qtd = data.get('novo_qtd')
    novo_vlr = data.get('novo_vlr')

    # Atualizar o nome do cliente no banco de dados
    
    sql = "UPDATE produtos SET prod_nome = %s, prod_qtd = %s, prod_valor = %s WHERE prod_id = %s"
    cursor.execute(sql, (novo_nome, novo_qtd, novo_vlr, produto_id))

    banco.commit()

    # Retornar uma resposta ao frontend
    return jsonify({'success': True})

@app.route('/produtos/excluir', methods=['POST'])
def excluir_produto():
    produto_id = request.form['produto_id']
    produto_nome = request.form['produto_nome']
    
    # Retorna um script de confirmação para o frontend, sem excluir o produto ainda
    return f"""
    <script>
        if (confirm('Tem certeza que deseja excluir o produto "{produto_nome}"?')) {{
            // Se o usuário confirmar, então a exclusão será feita
            fetch('/produtos/excluir/{produto_id}', {{
                method: 'DELETE',
            }})
            .then(response => {{
                if (response.ok) {{
                    alert('Produto "{produto_nome}" excluído com sucesso!');
                    window.location.href = '/produtos'; // Redireciona para a página de lista de produtos
                }} else {{
                    alert('Erro ao excluir o produto.');
                }}
            }});
        }} else {{
            // Se o usuário cancelar, apenas redireciona para a página de produtos
            window.location.href = '/produtos';
        }}
    </script>
    """

@app.route('/produtos/excluir/<int:produto_id>', methods=['DELETE'])
def excluir_produto_confirmado(produto_id):
    # Comando SQL para excluir o produto
    sql = "DELETE FROM produtos WHERE prod_id = %s"
    cursor.execute(sql, (produto_id,))
    
    banco.commit()

    return '', 200  # Retorna um status 200 OK se a exclusão for bem-sucedida

@app.route("/clientes/disponiveis", methods=["GET"])
def clientes_disponiveis():
    try:
        # Query para obter os produtos com estoque > 0
        cursor.execute("SELECT cli_nome FROM clientes")
        clientes = cursor.fetchall()
        
        # Formatar os dados como JSON
        resultado = [{"nome": cliente[0]} for cliente in clientes]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route('/clientes')
def consultar_cli():
    sql_consulta_cli = "SELECT * FROM clientes"

    cursor.execute(sql_consulta_cli)

    resultado = cursor.fetchall()

    return render_template("consultar_clientes.html", clientes=resultado)

@app.route('/clientes/cadastrar', methods=['POST'])
def cadastrar_cli():
    # Verifica se o request é JSON
    if request.is_json:
        data = request.get_json()
        cli_nome_py = data.get('nome')  # Pega o nome enviado no JSON

        if not cli_nome_py:
            return jsonify({"error": "Nome do cliente não fornecido"}), 400

        # Busca o último ID no banco de dados
        cursor.execute("SELECT MAX(cli_id) FROM clientes")
        cod_cli = cursor.fetchone()

        if cod_cli[0] is None:
            cli_id_py = 1
        else:
            cli_id_py = cod_cli[0] + 1

        # Insere o cliente no banco de dados
        sql_insert = "INSERT INTO clientes (cli_id, cli_nome) VALUES (%s, %s)"
        cursor.execute(sql_insert, (cli_id_py, cli_nome_py))
        banco.commit()

        # Retorna uma resposta de sucesso
        return jsonify({"message": f"Cliente cadastrado: {cli_nome_py}"}), 200
    else:
        # Caso o request não seja JSON, retorna erro
        return jsonify({"error": "Formato de dados inválido, esperado JSON"}), 400

@app.route('/clientes/alterar', methods=['POST'])
def alterar_cliente():
    # Receber os dados enviados do frontend
    data = request.get_json()
    cliente_id = data.get('id')
    novo_nome = data.get('novo_nome')

    # Atualizar o nome do cliente no banco de dados
    sql = "UPDATE clientes SET cli_nome = %s WHERE cli_id = %s"
    cursor.execute(sql, (novo_nome, cliente_id))

    banco.commit()

    # Retornar uma resposta ao frontend
    return jsonify({'success': True})

@app.route('/clientes/excluir', methods=['POST'])
def excluir_cliente():
    cli_id = request.form['cliente_id']
    cliente_nome = request.form['cliente_nome']
    
    sql = "DELETE FROM clientes WHERE cli_id = %s"
    cursor.execute(sql, (cli_id,))

    banco.commit()
    
    return f"""
    <script>
        alert('Cliente "{cliente_nome}" excluído com sucesso!');
        window.location.href = '/clientes';
    </script>
    """

@app.route('/vendas')
def consultar_vendas():
    sql_consulta_vend = "SELECT * FROM vendas"

    cursor.execute(sql_consulta_vend)

    resultado = cursor.fetchall()

    return render_template("consultar_vendas.html", vendas=resultado)

@app.route('/vendas/cadastrar', methods=['POST'])
def cadastrar_venda():
    # Verifica se o request é JSON
    if request.is_json:
        data = request.get_json()
        vnd_cliente_py = data.get('vnd_cliente')
        vnd_produto_py = data.get('vnd_produto')
        vnd_qtd_py = data.get('vnd_qtd')
        vnd_vlr_py = data.get('vnd_valor')
        #vnd_total_py = data.get('vnd_total')
        vnd_data_py = data.get('vnd_data')

        vnd_total_py = float(vnd_qtd_py) * float(vnd_vlr_py)


        # Busca o último ID no banco de dados
        cursor.execute("SELECT MAX(vnd_id) FROM vendas")
        cod_vnd = cursor.fetchone()

        if cod_vnd[0] is None:
            vnd_id_py = 1
        else:
            vnd_id_py = cod_vnd[0] + 1

        # Insere o produto no banco de dados
        sql_insert = "INSERT INTO vendas (vnd_id, vnd_cliente, vnd_produto, vnd_qtd, vnd_vlr, vnd_total, vnd_data) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql_insert, (vnd_id_py, vnd_cliente_py, vnd_produto_py, vnd_qtd_py, vnd_vlr_py, vnd_total_py, vnd_data_py))

        sql_upade_qtd = "UPDATE produtos SET prod_qtd = prod_qtd - %s WHERE prod_id = %s"
        cursor.execute(sql_upade_qtd,(vnd_qtd_py, vnd_id_py))
        banco.commit()

        # Retorna uma resposta de sucesso
        return jsonify({"message": f"Venda de {vnd_qtd_py} {vnd_produto_py} cadastrada!"}), 200

    else:
        # Caso o request não seja JSON, retorna erro
        return jsonify({"error": "Formato de dados inválido, esperado JSON"}), 400
    
@app.route('/vendas/alterar', methods= ['POST'])  
def alterar_venda():
    data = request.get_json()
    vnd_id = data.get('vnd_id')
    vnd_nome = data.get('novovnd_nome')
    vnd_prod = data.get('novovnd_prod')
    vnd_qtd = data.get('novovnd_qtd')
    vnd_vlr = data.get('novovnd_vlr')
    vnd_vlrtot = float(vnd_qtd) * float(vnd_vlr)
    vnd_data = data.get('novovnd_data')




    sql_dados_antigos = "SELECT vnd_qtd, vnd_produto FROM vendas WHERE vnd_id = %s"
    cursor.execute(sql_dados_antigos, (vnd_id,))
    dados_antigos = cursor.fetchone()
    vnd_qtd_antiga = dados_antigos[0]
    vnd_prod_antigo = dados_antigos[1]

    # Ajustar o estoque do produto antigo
    sql_ajustar_estoque_antigo = "UPDATE produtos SET prod_qtd = prod_qtd + %s WHERE prod_nome = %s"
    cursor.execute(sql_ajustar_estoque_antigo, (vnd_qtd_antiga, vnd_prod_antigo))

    # Ajustar o estoque do novo produto
    sql_ajustar_estoque_novo = "UPDATE produtos SET prod_qtd = prod_qtd - %s WHERE prod_nome = %s"
    cursor.execute(sql_ajustar_estoque_novo, (vnd_qtd, vnd_prod))



    sql = "UPDATE vendas SET vnd_cliente = %s, vnd_produto = %s, vnd_qtd = %s, vnd_vlr = %s, vnd_total = %s, vnd_data = %s WHERE vnd_id = %s"
    cursor.execute(sql, (vnd_nome, vnd_prod, vnd_qtd, vnd_vlr, vnd_vlrtot, vnd_data, vnd_id))

    banco.commit()

    return jsonify({'success': True})

@app.route('/vendas/excluir', methods=['POST'])
def excluir_venda():
    
    vnd_id = request.form['vnd_id']
    vnd_cliente = request.form['vnd_cli']
    vnd_qtd = request.form['vnd_qtd']
    vnd_produto = request.form['vnd_prod']

    sql_dados = "SELECT vnd_qtd, vnd_produto FROM vendas WHERE vnd_id = %s"
    cursor.execute(sql_dados, (vnd_id,))
    dados = cursor.fetchone()
    vnd_qtd = dados[0]
    vnd_prod = dados[1]

    sql_ajustar_estoque = "UPDATE produtos SET prod_qtd = prod_qtd + %s WHERE prod_nome = %s"
    cursor.execute(sql_ajustar_estoque, (vnd_qtd, vnd_prod))
    
    sql = "DELETE FROM vendas WHERE vnd_id = %s"
    cursor.execute(sql, (vnd_id,))

    banco.commit()
    
    return f"""
    <script>
        alert('Venda do cliente "{vnd_cliente}" de {vnd_qtd} {vnd_produto} excluído com sucesso!');
        window.location.href = '/vendas';
    </script>
    """

@app.route('/login', methods=['POST'])
def login():
    usuario = request.form['username']
    senha = request.form['password']

    query = "SELECT * FROM login WHERE usuario = %s AND senha = %s"
    cursor.execute(query, (usuario, senha))
    
    resultado = cursor.fetchone()
    
    if resultado:
        flash('Login bem-sucedido!', 'success')
        return render_template("home.html")  # Redirecionar para a página principal
    else:
        flash('Nome de usuário ou senha incorretos.', 'error')
        return render_template("loginpage.html")  # Redirecionar de volta para a página de login

if __name__ == "__main__":
    app.run(debug=True)

cursor.close()
banco.close()



