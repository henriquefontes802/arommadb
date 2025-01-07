document.addEventListener('DOMContentLoaded', function () {

    const botoesAlterar = document.querySelectorAll('.alterarVenda');


    botoesAlterar.forEach(botao => {
        botao.addEventListener('click', function () {
            const linha = this.parentElement.parentElement; 
            const nomeVenda = linha.querySelector('.clienteVenda'); 
            const produtoVenda = linha.querySelector('.produtoVenda');
            const qtdVenda = linha.querySelector('.qtdVenda');
            const vlrVenda = linha.querySelector('.vlrVenda')

            const dataVenda = linha.querySelector('.dataVenda')
            const botaoAtual = this; 

            if (botaoAtual.textContent === 'Alterar') {

                const nomeAtual = nomeVenda.textContent;
                const produtoAtual = produtoVenda.textContent;
                const qtdAtual = qtdVenda.textContent;
                const vlrAtual = vlrVenda.textContent;
                const dataAtual = dataVenda.textContent;
                nomeVenda.innerHTML = `<input type="text" value="${nomeAtual}" class="input-nome">`;
                produtoVenda.innerHTML = `<input type="text" value="${produtoAtual}" class="input-produto">`;
                qtdVenda.innerHTML = `<input type="number" value="${qtdAtual}" class="input-qtd">`;
                vlrVenda.innerHTML = `<input type="number" value="${vlrAtual}" class="input-vlr" step="0.01">`;
                dataVenda.innerHTML = `<input type="data" value="${dataAtual}" class="input-data">`;
                botaoAtual.textContent = 'Salvar';
            } else {
                const novoNome = linha.querySelector('.input-nome').value
                const novoProduto = linha.querySelector('.input-produto').value
                const novaQtd = linha.querySelector('.input-qtd').value
                const novoVlr = linha.querySelector('.input-vlr').value
                const novaData = linha.querySelector('.input-data').value

                nomeVenda.textContent = novoNome;
                produtoVenda.textContent = novoProduto;
                qtdVenda.textContent = novaQtd;
                vlrVenda.textContent = novoVlr;
                dataVenda.textContent = novaData;

                botaoAtual.textContent = 'Alterar';

                const vendaId = linha.querySelector('.idVenda').textContent;
                
                const dados = { vnd_id: vendaId, novovnd_nome: novoNome, novovnd_prod: novoProduto, novovnd_qtd: novaQtd, novovnd_vlr: novoVlr, novovnd_data: novaData };
                
                fetch('/vendas/alterar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Venda alterada com sucesso!');
                    } else {
                        alert('Erro ao alterar venda.');
                    }

                window.location.href = '/vendas'  
                  
                })
                .catch(error => {
                    alert('Erro de comunicação com o servidor.');
                    console.error(error);
                });
            }
        });
    });
});
