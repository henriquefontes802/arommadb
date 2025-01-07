document.addEventListener('DOMContentLoaded', function () {
    // Seleciona todos os botões "Alterar"
    const botoesAlterar = document.querySelectorAll('.alterarProduto');

    // Adiciona um evento de clique para cada botão
    botoesAlterar.forEach(botao => {
        botao.addEventListener('click', function () {
            const linha = this.parentElement.parentElement; // Pega a linha do produto
            const nomeCelula = linha.querySelector('.nomeProduto'); // Célula do nome
            const qtdCelula = linha.querySelector('.qtdProduto');
            const vlrCelula = linha.querySelector('.vlrProduto');
            const botaoAtual = this; // O botão clicado

            if (botaoAtual.textContent === 'Alterar') {
                // Torna o nome editável
                const nomeAtual = nomeCelula.textContent;
                const qtdAtual = qtdCelula.textContent;
                const vlrAtual = vlrCelula.textContent;
                nomeCelula.innerHTML = `<input type="text" value="${nomeAtual}" class="input-nome">`;
                qtdCelula.innerHTML = `<input type="number" value="${qtdAtual}" class="input-qtd">`;
                vlrCelula.innerHTML = `<input type="number" value="${vlrAtual}" class="input-vlr" step="0.01">`;
                botaoAtual.textContent = 'Salvar'; // Muda o botão para "Salvar"
            } else {
                // Salva a alteração e envia para o servidor
                const novoNome = linha.querySelector('.input-nome').value;
                const novoqtd = linha.querySelector('.input-qtd').value;
                const novovlr = linha.querySelector('.input-vlr').value;
                nomeCelula.textContent = novoNome; // Atualiza o nome exibido
                qtdCelula.textContent = novoqtd;
                vlrCelula.textContent = novovlr;

                botaoAtual.textContent = 'Alterar'; // Restaura o botão para "Alterar"

                // Enviar a alteração para o backend (Python)
                const produtoId = linha.querySelector('.idProduto').textContent; // Exemplo de como pegar o ID de uma célula específica


                
                // Cria um objeto com os dados a serem enviados
                const dados = { id: produtoId, novo_nome: novoNome, novo_qtd: novoqtd, novo_vlr: novovlr };
                
                // Envia a requisição para o Python
                fetch('/produtos/alterar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados) // Converte os dados para JSON
                })
                .then(response => response.json()) // Espera o retorno do servidor
                .then(data => {
                    if (data.success) {
                        alert('Produto alterado com sucesso!');
                    } else {
                        alert('Erro ao alterar produto.');
                    }
                })
                .catch(error => {
                    alert('Erro de comunicação com o servidor.');
                    console.error(error);
                });
            }
        });
    });
});
