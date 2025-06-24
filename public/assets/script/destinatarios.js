document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://meu-back-contratofacil-production.up.railway.app/api";
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    
    if (!usuarioLogado) {
        window.location.href = "login.html";
        return;
    }

    // Elementos DOM
    const listaDestinatarios = document.getElementById("listaDestinatarios");
    const nomeUsuario = document.getElementById("nomeUsuario");
    const tipoUsuario = document.getElementById("tipoUsuario");

    // Exibir informações do usuário logado
    if (nomeUsuario) nomeUsuario.textContent = usuarioLogado.nome || "Usuário";
    if (tipoUsuario) tipoUsuario.textContent = usuarioLogado.tipo || (usuarioLogado.cpf === "12345678910" ? "Gestor" : "Funcionário");

    try {
        await carregarDestinatarios();
    } catch (error) {
        console.error("Erro ao carregar destinatários:", error);
        exibirMensagemErro("Erro ao carregar lista de destinatários");
    }

    async function carregarDestinatarios() {
        let destinatarios = [];
        
        // Se for gestor, buscar funcionários
        if (usuarioLogado.tipo === "Gestor" || usuarioLogado.cpf === "12345678910") {
            const response = await fetch(`${API_URL}/funcionarios`);
            const funcionarios = await response.json();
            destinatarios = funcionarios.map(func => ({
                ...func,
                tipoDisplay: "Funcionário"
            }));
        } 
        // Se for funcionário, buscar gestores
        else {
            const response = await fetch(`${API_URL}/gestores`);
            const gestores = await response.json();
            destinatarios = gestores.map(gestor => ({
                ...gestor,
                tipoDisplay: "Gestor"
            }));
        }

        renderizarDestinatarios(destinatarios);
    }

    function renderizarDestinatarios(destinatarios) {
        if (!listaDestinatarios) return;

        listaDestinatarios.innerHTML = "";

        if (destinatarios.length === 0) {
            listaDestinatarios.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle me-2"></i>
                    Nenhum destinatário disponível
                </div>
            `;
            return;
        }

        destinatarios.forEach((destinatario, index) => {
            const card = document.createElement("div");
            card.className = "col-md-6 col-lg-4 mb-3";
            
            // Adicionar delay na animação para criar efeito escalonado
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="card h-100 destinatario-card">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex align-items-center mb-3">
                            <div class="avatar-circle me-3">
                                <i class="fas ${destinatario.tipoDisplay === 'Gestor' ? 'fa-user-tie' : 'fa-user'} fa-lg"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h5 class="card-title mb-1">${destinatario.nome || 'Nome não informado'}</h5>
                                <small class="text-muted">
                                    <i class="fas fa-tag me-1"></i>${destinatario.tipoDisplay}
                                </small>
                            </div>
                        </div>
                        
                        <div class="contact-info mb-3">
                            <div class="mb-2">
                                <i class="fas fa-id-card me-2"></i>
                                <span>CPF: ${formatarCPF(destinatario.cpf)}</span>
                            </div>
                            ${destinatario.email ? `
                                <div class="mb-2">
                                    <i class="fas fa-envelope me-2"></i>
                                    <span>${destinatario.email}</span>
                                </div>
                            ` : ''}
                            ${destinatario.telefone ? `
                                <div class="mb-2">
                                    <i class="fas fa-phone me-2"></i>
                                    <span>${destinatario.telefone}</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="mt-auto">
                            <button class="btn btn-iniciar-chat w-100" 
                                    data-cpf="${destinatario.cpf}" 
                                    data-nome="${destinatario.nome || 'Usuário'}"
                                    data-tipo="${destinatario.tipoDisplay}">
                                <i class="fas fa-comments me-2"></i>
                                Iniciar Chat
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Adicionar event listener para o botão de chat
            const btnChat = card.querySelector('.btn-iniciar-chat');
            btnChat.addEventListener('click', (e) => {
                e.stopPropagation();
                const cpfDestinatario = e.target.dataset.cpf;
                const nomeDestinatario = e.target.dataset.nome;
                const tipoDestinatario = e.target.dataset.tipo;
                
                // Feedback visual no clique
                btnChat.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btnChat.style.transform = '';
                }, 150);
                
                // Armazenar dados do destinatário para usar no chat
                localStorage.setItem("destinatarioChat", JSON.stringify({
                    cpf: cpfDestinatario,
                    nome: nomeDestinatario,
                    tipo: tipoDestinatario
                }));
                
                // Redirecionar para a página de chat
                window.location.href = "chat.html";
            });

            // Event listener para clique no card inteiro
            const cardElement = card.querySelector('.destinatario-card');
            cardElement.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-iniciar-chat')) {
                    btnChat.click();
                }
            });

            listaDestinatarios.appendChild(card);
        });
    }

    function formatarCPF(cpf) {
        if (!cpf) return "Não informado";
        const cpfLimpo = cpf.replace(/\D/g, '');
        return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    function exibirMensagemErro(mensagem) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto remover após 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
});