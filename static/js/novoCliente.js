document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.getElementById("formContainer");
    const formNovoCliente = document.getElementById("formNovoCliente");
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
    formNovoCliente.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evitar recarregamento da página

        const input = document.getElementById("novoClienteInput");
        const nomeCliente = input.value.trim();

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
                    input.value = "";
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
