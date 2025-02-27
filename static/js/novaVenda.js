document.addEventListener("DOMContentLoaded", () => {
    const novaVendaBtn = document.querySelector(".novaVenda");
    const formNovaVendaRow = document.getElementById("formNovaVendaRow");
    const mensagem = document.getElementById("mensagem");

    // Mostrar formulário
    window.mostrarFormulario = () => {
        formNovaVendaRow.style.display = "table-row"; // Exibe a linha do formulário
        novaVendaBtn.style.display = "none"; // Oculta o botão "Nova Venda"
        carregarClientes();
        carregarProdutos();
    };

    // Ocultar formulário
    window.ocultarFormulario = () => {
        formNovaVendaRow.style.display = "none"; // Oculta a linha do formulário
        novaVendaBtn.style.display = "inline"; // Exibe o botão "Nova Venda"
        mensagem.style.display = "none"; // Oculta a mensagem de feedback
    };

    // Carregar clientes disponíveis
    async function carregarClientes() {
        const clienteSelect = document.getElementById("novoClienteVendaInput");
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
    }

    // Carregar produtos disponíveis
    async function carregarProdutos() {
        const produtoSelect = document.getElementById("novoProdutoVendaInput");
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
    }

    // Adicionar evento ao botão "Adicionar"
    const adicionarBtn = document.getElementById("adicionarVenda");
    adicionarBtn.addEventListener("click", async () => {
        const clienteSelect = document.getElementById("novoClienteVendaInput");
        const produtoSelect = document.getElementById("novoProdutoVendaInput");
        const inputQtd = document.getElementById("novaQtdVendaInput");
        const inputVlr = document.getElementById("novoVlrVendaInput");
        const inputData = document.getElementById("novaDataVenda");

        const cliente = clienteSelect.value.trim();
        const produto = produtoSelect.value.trim();
        const qtd = inputQtd.value.trim();
        const vlr = inputVlr.value.trim();
        const data = inputData.value.trim();

        if (cliente && produto && qtd && vlr && data) {
            try {
                const response = await fetch("/vendas/cadastrar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        vnd_cliente: cliente,
                        vnd_produto: produto,
                        vnd_qtd: qtd,
                        vnd_valor: vlr,
                        vnd_data: data
                    })
                });

                const dataResponse = await response.json();

                if (response.ok) {
                    // Feedback de sucesso
                    mensagem.textContent = `Venda cadastrada com sucesso!`;
                    mensagem.style.backgroundColor = "#d4edda";
                    mensagem.style.color = "#155724";
                    mensagem.style.display = "block";

                    // Limpar o formulário
                    clienteSelect.value = "";
                    produtoSelect.value = "";
                    inputQtd.value = "";
                    inputVlr.value = "";
                    inputData.value = "";
                    ocultarFormulario();

                    // Recarregar a lista de vendas
                    window.location.reload();
                } else {
                    // Feedback de erro
                    mensagem.textContent = `Erro: ${dataResponse.error}`;
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
