document.addEventListener("DOMContentLoaded", () => {
    const novoClienteBtn = document.querySelector(".novoCliente");
    const clientesTable = document.querySelector("#clientesTable tbody");

    novoClienteBtn.addEventListener("click", () => {
        // Esconder o botão "Novo Cliente"
        novoClienteBtn.style.display = "none";

        // Criar uma nova linha editável
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td></td>
            <td><input type="text" id="novoClienteInput" placeholder="Nome do Cliente"></td>
            <td><button id="adicionarCliente">Adicionar</button></td>
        `;
        clientesTable.appendChild(newRow);

        // Adicionar evento ao botão "Adicionar"
        const adicionarBtn = newRow.querySelector("#adicionarCliente");
        adicionarBtn.addEventListener("click", async () => {
            const input = newRow.querySelector("#novoClienteInput");
            const nomeCliente = input.value.trim();

            if (nomeCliente) {
                // Enviar o nome do cliente para o servidor
                try {
                    const response = await fetch("/clientes/cadastrar", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ nome: nomeCliente })
                    });

                    if (response.ok) {
                        alert("Cliente cadastrado com sucesso!");
                        // Remover a linha e reexibir o botão "Novo Cliente"
                        newRow.remove();
                        novoClienteBtn.style.display = "inline"; // Ou "block", dependendo do estilo desejado
                    } else {
                        alert("Erro ao cadastrar o cliente.");
                    }

                    window.location.href = '/clientes'

                } catch (error) {
                    console.error("Erro:", error);
                    alert("Erro ao se conectar com o servidor.");
                }
            } else {
                alert("Por favor, insira um nome válido.");
            }
        });
    });
});
