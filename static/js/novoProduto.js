document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.getElementById("formContainer");
    const formNovoProduto = document.getElementById("formNovoProduto");
    const mensagem = document.getElementById("mensagem");

    // Mostrar formulário
    window.mostrarFormulario = () => {
        formContainer.style.display = "block";
    };

    // Ocultar formulário
    window.ocultarFormulario = () => {
        formContainer.style.display = "none";
        mensagem.style.display = "none";
    };

    // Enviar formulário
    formNovoProduto.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evitar recarregamento da página

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
