document.addEventListener("DOMContentLoaded", () => {
    const novoProdutoBtn = document.querySelector(".novoProduto");
    const formNovoProdutoRow = document.getElementById("formNovoProdutoRow");
    const mensagem = document.getElementById("mensagem");

    // Mostrar formulário
    window.mostrarFormulario = () => {
        formNovoProdutoRow.style.display = "table-row"; // Exibe a linha do formulário
        novoProdutoBtn.style.display = "none"; // Oculta o botão "Novo Produto"
    };

    // Ocultar formulário
    window.ocultarFormulario = () => {
        formNovoProdutoRow.style.display = "none"; // Oculta a linha do formulário
        novoProdutoBtn.style.display = "inline"; // Exibe o botão "Novo Produto"
        mensagem.style.display = "none"; // Oculta a mensagem de feedback
    };

    // Adicionar evento ao botão "Adicionar"
    const adicionarBtn = document.getElementById("adicionarProduto");
    adicionarBtn.addEventListener("click", async () => {
        const inputNome = document.getElementById("novoProdutoInput");
        const inputQtd = document.getElementById("novaqtdProdutoInput");
        const inputVlr = document.getElementById("novovlrProdutoInput");

        const nomeProduto = inputNome.value.trim();
        const qtdProduto = inputQtd.value.trim();
        const vlrProduto = inputVlr.value.trim();

        if (nomeProduto && qtdProduto && vlrProduto) {
            try {
                const response = await fetch("/produtos/cadastrar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prod_nome: nomeProduto,
                        prod_qtd: qtdProduto,
                        prod_valor: vlrProduto
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Feedback de sucesso
                    mensagem.textContent = `Produto "${data.message}" cadastrado com sucesso!`;
                    mensagem.style.backgroundColor = "#d4edda";
                    mensagem.style.color = "#155724";
                    mensagem.style.display = "block";

                    // Limpar o formulário
                    inputNome.value = "";
                    inputQtd.value = "";
                    inputVlr.value = "";
                    ocultarFormulario();

                    // Recarregar a lista de produtos
                    window.location.reload();
                } else {
                    // Feedback de erro
                    mensagem.textContent = `Erro: ${data.error}`;
                    mensagem.style.backgroundColor = "#f8d7da";
                    mensagem.style.color = "#721c24";
                    mensagem.style.display = "block";
                }
            } catch (error) {
                console.error("Erro:", error);
                mensagem.textContent = "Erro ao se conectar com o servidor.";
                mensagem.style.backgroundColor = "#f8d7da";
                mensagem.style.color = "#721c24";
                mensagem.style.display = "block";
            }
        } else {
            mensagem.textContent = "Por favor, preencha todos os campos.";
            mensagem.style.backgroundColor = "#fff3cd";
            mensagem.style.color = "#856404";
            mensagem.style.display = "block";
        }
    });
});
