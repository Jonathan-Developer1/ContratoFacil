document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const mensagemErro = document.getElementById("mensagemErro");
    const tipoAcessoSelecionado = document.getElementById("tipoAcessoSelecionado");
    const API_URL = "http://localhost:3000";

    try {removeUsuario();}
    catch(e)
    {
        console.log("Problemas em removeUsuario()",e);
    }

    // Dropdown para selecionar tipo de acesso
    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const tipo = e.target.dataset.value;
            tipoAcessoSelecionado.value = tipo;
            document.getElementById("dropdownMenuButton").textContent = e.target.textContent;
        });
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        mensagemErro.classList.add("d-none");

        const cpf = document.getElementById("cpf").value.trim().replace(/\D/g, '');
        const senha = document.getElementById("senha").value.trim();
        const tipo = tipoAcessoSelecionado.value;

        if (!cpf || !senha || !tipo) {
            return exibirErro("Preencha CPF, senha e selecione o tipo de acesso.");
        }

        const rota = tipo === "gestor" ? "gestores" : "funcionarios";
        const url = `${API_URL}/${rota}?cpf=${cpf}&senha=${senha}`;

        try {
            const resposta = await fetch(url);
            const dados = await resposta.json();

            if (dados.length > 0) {
                // Usuário autenticado
                localStorage.setItem("usuarioLogado", JSON.stringify(dados[0]));
                window.location.href = tipo === "gestor" ? "dashboard-gestor.html" : "dashboard-funcionario.html";
            } 
            else {
                exibirErro("CPF ou senha inválidos.");
            }
        } catch (erro) {
            console.error("Erro ao realizar login:", erro);
            exibirErro("Erro de conexão com o servidor.");
        }
    });

    function exibirErro(mensagem) {
        mensagemErro.textContent = mensagem;
        mensagemErro.classList.remove("d-none");
        setTimeout(() => mensagemErro.classList.add("d-none"), 4000);
    }
    
    function removeUsuario()
    {
        document.getElementById('sair').addEventListener('click', () =>{

    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
    });
    }
    
});
