document.addEventListener("DOMContentLoaded", () => {
    const novoVendaBtn = document.querySelector(".novaVenda");
    const vendasTable = document.querySelector("#vendasTable tbody");

    novoVendaBtn.addEventListener("click", async () => {

        novoVendaBtn.style.display = "none";

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td></td>
            <td>
                <select id="novoClienteVendaInput">
                    <option value="">Selecione um cliente</option>
                </select>
            </td>
            <td>
                <select id="novoProdutoVendaInput">
                    <option value="">Selecione um produto</option>
                </select>
            </td>
            <td><input type="number" id="novaQtdVendaInput" placeholder="Quantidade"></td>
            <td><input type="number" step="0.01" id="novoVlrVendaInput" placeholder="Valor"></td>
            <td></td>
            <td><input type="date" id="novaDataVenda" placeholder="Data"></td>
            <td><button id="adicionarVenda">Adicionar</button></td>
        `;
        vendasTable.appendChild(newRow);

        const clienteSelect = newRow.querySelector("#novoClienteVendaInput");
        const produtoSelect = newRow.querySelector("#novoProdutoVendaInput");
        const adicionarBtn = newRow.querySelector("#adicionarVenda");
    
        try {
            const response = await fetch("/clientes/disponiveis");
            if (response.ok) {
                const clientes = await response.json();
                clientes.forEach(cliente => {
                    const option = document.createElement("option");
                    option.value = cliente.nome;
                    option.textContent = cliente.nome;
                    clienteSelect.appendChild(option);
                });
            } else {
                alert("Erro ao carregar clientes disponíveis.");
            }
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }

        try {
            const response = await fetch("/produtos/disponiveis");
            if (response.ok) {
                const produtos = await response.json();
                produtos.forEach(produto => {
                    const option = document.createElement("option");
                    option.value = produto.nome;
                    option.textContent = produto.nome;
                    produtoSelect.appendChild(option);
                });
            } else {
                alert("Erro ao carregar produtos disponíveis.");
            }
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }

        adicionarBtn.addEventListener("click", async () => {
            const inputnovoClienteVenda = newRow.querySelector("#novoClienteVendaInput");
            //const inputnovoProdutoVenda = newRow.querySelector("#novoProdutoVendaInput");
            const inputnovaQtdVenda = newRow.querySelector("#novaQtdVendaInput");
            const inputnovoVlrVenda = newRow.querySelector("#novoVlrVendaInput");
            const inputnovaDatavenda = newRow.querySelector("#novaDataVenda");

            const NomeClienteVenda = inputnovoClienteVenda.value.trim();
            const ProdutoVenda = produtoSelect.value.trim();
            const QtdVenda = inputnovaQtdVenda.value.trim();
            const VlrVenda = inputnovoVlrVenda.value.trim();
            const DataVenda = inputnovaDatavenda.value.trim();

         
            if (NomeClienteVenda, ProdutoVenda, QtdVenda, VlrVenda, DataVenda) {
       
                try {
                    const response = await fetch("/vendas/cadastrar", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        
                        body: JSON.stringify({ vnd_cliente: NomeClienteVenda, vnd_produto: ProdutoVenda, vnd_qtd: QtdVenda, vnd_valor: VlrVenda, vnd_data: DataVenda })
                    });

                    if (response.ok) {
                        alert("Venda cadastrada com sucesso!");
                        
                        newRow.remove();
                        novoVendaBtn.style.display = "inline";

                    } else {
                        alert("Erro ao cadastrar venda.");
                    }

                    window.location.href = '/vendas'
                    
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
