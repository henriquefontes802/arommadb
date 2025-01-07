document.addEventListener('DOMContentLoaded', function () {
    // Seleciona todos os botões "Alterar"
    const botoesAlterar = document.querySelectorAll('.alterarCliente');

    // Adiciona um evento de clique para cada botão
    botoesAlterar.forEach(botao => {
        botao.addEventListener('click', function () {
            const linha = this.parentElement.parentElement; // Pega a linha do cliente
            const nomeCelula = linha.querySelector('.nomeCliente'); // Célula do nome
            const botaoAtual = this; // O botão clicado

            if (botaoAtual.textContent === 'Alterar') {
                // Torna o nome editável
                const nomeAtual = nomeCelula.textContent;
                nomeCelula.innerHTML = `<input type="text" value="${nomeAtual}" class="input-nome">`;
                botaoAtual.textContent = 'Salvar'; // Muda o botão para "Salvar"
            } else {
                // Salva a alteração e envia para o servidor
                const novoNome = linha.querySelector('.input-nome').value;
                nomeCelula.textContent = novoNome; // Atualiza o nome exibido
                botaoAtual.textContent = 'Alterar'; // Restaura o botão para "Alterar"

                // Enviar a alteração para o backend (Python)
                const clienteId = linha.cells[0].textContent; // Pega o ID diretamente, usando o índice

                
                // Cria um objeto com os dados a serem enviados
                const dados = { id: clienteId, novo_nome: novoNome };
                
                // Envia a requisição para o Python
                fetch('/clientes/alterar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados) // Converte os dados para JSON
                })
                .then(response => response.json()) // Espera o retorno do servidor
                .then(data => {
                    if (data.success) {
                        alert('Cliente alterado com sucesso!');
                    } else {
                        alert('Erro ao alterar cliente.');
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
