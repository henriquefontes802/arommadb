document.addEventListener("DOMContentLoaded", () => {
    const novoProdutoBtn = document.querySelector(".novoProduto");
    const produtosTable = document.querySelector("#produtosTable tbody");

    novoProdutoBtn.addEventListener("click", () => {
        // Esconder o botão "Novo Produto"
        novoProdutoBtn.style.display = "none";

        // Criar uma nova linha editável
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td></td>
            <td><input type="text" id="novoProdutoInput" placeholder="Produto"></td>
            <td><input type="number" id="novaqtdProdutoInput" placeholder="Quantidade"></td>
            <td><input type="number" step="0.01" id="novovlrProdutoInput" placeholder="Valor"></td>
            <td><button id="adicionarProduto">Adicionar</button></td>
        `;
        produtosTable.appendChild(newRow);

        // Adicionar evento ao botão "Adicionar"
        const adicionarBtn = newRow.querySelector("#adicionarProduto");
        adicionarBtn.addEventListener("click", async () => {
            const inputnovoProduto = newRow.querySelector("#novoProdutoInput");
            const inputnovaqtdProduto = newRow.querySelector("#novaqtdProdutoInput");
            const inputnovovlrProduto = newRow.querySelector("#novovlrProdutoInput");
            const nomeProduto = inputnovoProduto.value.trim();
            const qtdProduto = inputnovaqtdProduto.value.trim();
            const vlrProduto = inputnovovlrProduto.value.trim();

            if (nomeProduto, qtdProduto, vlrProduto) {
                // Enviar o nome do produto para o servidor
                try {
                    const response = await fetch("/produtos/cadastrar", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ prod_nome: nomeProduto, prod_qtd: qtdProduto, prod_valor: vlrProduto })
                    });

                    if (response.ok) {
                        alert("Produto cadastrado com sucesso!");
                        // Remover a linha e reexibir o botão "Novo Produto"
                        newRow.remove();
                        novoProdutoBtn.style.display = "inline"; // Ou "block", dependendo do estilo desejado

                    } else {
                        alert("Erro ao cadastrar o produto.");
                    }

                    window.location.href = '/produtos'
                    
                } catch (error) {
                    console.error("Erro:", error);
                    alert("Erro ao se conectar com o servidor.");
                }
            } else {
                alert("Por favor, insira um dado válido.");
            }
        });
    });
});
