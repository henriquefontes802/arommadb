document.addEventListener("DOMContentLoaded", () => {
    const novoClienteBtn = document.querySelector(".novoCliente");
    const formNovoClienteRow = document.getElementById("formNovoClienteRow");
    const mensagem = document.getElementById("mensagem");

    // Mostrar formulário
    window.mostrarFormulario = () => {
        formNovoClienteRow.style.display = "table-row"; // Exibe a linha do formulário
        novoClienteBtn.style.display = "none"; // Oculta o botão "Novo Cliente"
    };

    // Ocultar formulário
    window.ocultarFormulario = () => {
        formNovoClienteRow.style.display = "none"; // Oculta a linha do formulário
        novoClienteBtn.style.display = "inline"; // Exibe o botão "Novo Cliente"
        mensagem.style.display = "none"; // Oculta a mensagem de feedback
    };

    // Adicionar evento ao botão "Adicionar"
    const adicionarBtn = document.getElementById("adicionarCliente");
    adicionarBtn.addEventListener("click", async () => {
        const inputNome = document.getElementById("novoClienteInput");
        const nomeCliente = inputNome.value.trim();

        if (nomeCliente) {
            try {
                const response = await fetch("/clientes/cadastrar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ nome: nomeCliente })
                });

                const data = await response.json();

                if (response.ok) {
                    // Feedback de sucesso
                    mensagem.textContent = `Cliente "${data.message}" cadastrado com sucesso!`;
                    mensagem.style.backgroundColor = "#d4edda";
                    mensagem.style.color = "#155724";
                    mensagem.style.display = "block";

                    // Limpar o formulário
                    inputNome.value = "";
                    ocultarFormulario();

                    // Recarregar a lista de clientes
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
            mensagem.textContent = "Por favor, insira um nome válido.";
            mensagem.style.backgroundColor = "#fff3cd";
            mensagem.style.color = "#856404";
            mensagem.style.display = "block";
        }
    });
});
