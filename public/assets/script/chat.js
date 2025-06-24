document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://meu-back-contratofacil-production.up.railway.app/api";
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const destinatarioChat = JSON.parse(localStorage.getItem("destinatarioChat"));
    
    if (!usuarioLogado || !destinatarioChat) {
        window.location.href = "destinatarios.html";
        return;
    }

    // Elementos DOM
    const chatContainer = document.getElementById("chat-messages");
    const mensagemInput = document.getElementById("message-input");
    const btnEnviar = document.getElementById("send-button");
    const chatHeader = document.querySelector(".chat-header h2");

    // Variáveis para controle de estado
    let ultimaAtualizacao = 0;
    let mensagensCache = [];
    let intervalId = null;

    // Configurar interface
    if (chatHeader) {
        chatHeader.innerHTML = `
            <div style="display: flex; align-items: center; width: 100%;">
                <button onclick="window.location.href='destinatarios.html'" style="background: none; border: none; margin-right: 15px; color: black; font-size: 18px; cursor: pointer;">
                    ←
                </button>
                <div>
                    <div style="font-weight: bold; color: black; font-size: 1.1rem;">${destinatarioChat.nome}</div>
                    <small style="color: rgb(0, 0, 0); font-size: 0.9rem;">${destinatarioChat.tipo}</small>
                </div>
            </div>
        `;
    }

    // Event listeners
    if (btnEnviar) btnEnviar.addEventListener("click", enviarMensagem);
    if (mensagemInput) {
        mensagemInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                enviarMensagem();
            }
        });
    }

    // Carregar mensagens iniciais
    await carregarMensagens(true);

    // Configurar atualização automática mais frequente
    iniciarAtualizacaoAutomatica();

    // Listener para quando a página ganha foco (usuário volta para a aba)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            carregarMensagens(true);
        }
    });

    function iniciarAtualizacaoAutomatica() {
        // Limpar interval anterior se existir
        if (intervalId) {
            clearInterval(intervalId);
        }
        
        // Atualizar a cada 1 segundo para maior responsividade
        intervalId = setInterval(() => {
            carregarMensagens(false);
        }, 1000);
    }

    async function carregarMensagens(forcarAtualizacao = false) {
        try {
            const response = await fetch(`${API_URL}/mensagens?_t=${Date.now()}`);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const todasMensagens = await response.json();
            
            // Filtrar mensagens entre o usuário logado e o destinatário
            const mensagensConversa = todasMensagens.filter(msg => 
                (msg.remetente === usuarioLogado.cpf && msg.destinatario === destinatarioChat.cpf) ||
                (msg.remetente === destinatarioChat.cpf && msg.destinatario === usuarioLogado.cpf)
            );

            // Ordenar por timestamp
            mensagensConversa.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            // Verificar se há mudanças
            const mensagensString = JSON.stringify(mensagensConversa);
            const cacheString = JSON.stringify(mensagensCache);
            
            if (forcarAtualizacao || mensagensString !== cacheString) {
                mensagensCache = mensagensConversa;
                ultimaAtualizacao = Date.now();
                renderizarMensagens(mensagensConversa);
            }

        } catch (error) {
            console.error("Erro ao carregar mensagens:", error);
            
            // Tentar novamente após 2 segundos em caso de erro
            setTimeout(() => {
                carregarMensagens(true);
            }, 2000);
        }
    }

    function renderizarMensagens(mensagens) {
        if (!chatContainer) return;

        // Salvar posição do scroll antes de atualizar
        const scrollTop = chatContainer.scrollTop;
        const scrollHeight = chatContainer.scrollHeight;
        const clientHeight = chatContainer.clientHeight;
        const wasAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

        chatContainer.innerHTML = "";

        if (mensagens.length === 0) {
            chatContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-comments fa-3x mb-3"></i>
                    <p>Nenhuma mensagem ainda. Inicie a conversa!</p>
                </div>
            `;
            return;
        }

        mensagens.forEach(mensagem => {
            const isPropriaMsg = mensagem.remetente === usuarioLogado.cpf;
            const msgElement = document.createElement("div");
            msgElement.className = `message-wrapper ${isPropriaMsg ? 'own-message' : 'other-message'} mb-3`;
            
            const timestamp = new Date(mensagem.timestamp);
            const timeString = timestamp.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            msgElement.innerHTML = `
                <div class="message-bubble ${isPropriaMsg ? 'bg-primary text-white' : 'bg-light'}">
                    <div class="message-header mb-1">
                        <small class="message-sender ${isPropriaMsg ? 'text-white-50' : 'text-muted'}">
                            ${isPropriaMsg ? 'Você' : (mensagem.remetenteNome || destinatarioChat.nome)}
                        </small>
                        ${isPropriaMsg ? `
                            <button class="delete-btn" onclick="excluirMensagem('${mensagem.id}')" title="Excluir mensagem">
                                ×
                            </button>
                        ` : ''}
                    </div>
                    <div class="message-content">
                        ${escapeHtml(mensagem.conteudo)}
                    </div>
                    <div class="message-time mt-1">
                        <small class="${isPropriaMsg ? 'text-white-50' : 'text-muted'}">
                            ${timeString}
                        </small>
                    </div>
                </div>
            `;

            chatContainer.appendChild(msgElement);
        });

        // Manter posição do scroll ou ir para o final se estava no final
        if (wasAtBottom) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        } else {
            chatContainer.scrollTop = scrollTop;
        }
    }

    // Função para excluir mensagem
    window.excluirMensagem = async function(mensagemId) {
        if (!confirm('Tem certeza que deseja excluir esta mensagem?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/mensagens/${mensagemId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Forçar atualização das mensagens
                await carregarMensagens(true);
                
                console.log('Mensagem excluída com sucesso');
            } else {
                throw new Error('Erro ao excluir mensagem');
            }
        } catch (error) {
            console.error('Erro ao excluir mensagem:', error);
            alert('Erro ao excluir mensagem. Tente novamente.');
        }
    };

    async function enviarMensagem() {
        if (!mensagemInput) return;

        const conteudo = mensagemInput.value.trim();
        if (!conteudo) {
            return; // Simplesmente não faz nada se não há conteúdo
        }

        // Desabilitar botão e input enquanto envia
        if (btnEnviar) btnEnviar.disabled = true;
        if (mensagemInput) mensagemInput.disabled = true;

        try {
            const novaMensagem = {
                id: gerarId(),
                remetente: usuarioLogado.cpf,
                remetenteNome: usuarioLogado.nome || "Usuário",
                destinatario: destinatarioChat.cpf,
                conteudo: conteudo,
                timestamp: new Date().toISOString(),
                tipoRemetente: usuarioLogado.tipo === "Gestor" || usuarioLogado.cpf === "12345678910" ? "gestor" : "funcionario"
            };

            // Limpar input imediatamente para melhor UX
            mensagemInput.value = "";

            // Enviar mensagem
            const response = await fetch(`${API_URL}/mensagens`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novaMensagem)
            });

            if (response.ok) {
                // Criar notificação para o destinatário
                await criarNotificacao(conteudo);
                
                // Forçar atualização imediata das mensagens
                await carregarMensagens(true);
                
                // Focar no input novamente
                if (mensagemInput) mensagemInput.focus();
            } else {
                // Restaurar o conteúdo se houve erro
                mensagemInput.value = conteudo;
                throw new Error("Erro ao enviar mensagem");
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            
            // Restaurar o conteúdo se não foi restaurado ainda
            if (!mensagemInput.value) {
                mensagemInput.value = conteudo;
            }
        } finally {
            // Reabilitar botão e input
            if (btnEnviar) btnEnviar.disabled = false;
            if (mensagemInput) mensagemInput.disabled = false;
        }
    }

    async function criarNotificacao(conteudo) {
        try {
            const tipoRemetente = usuarioLogado.tipo === "Gestor" || usuarioLogado.cpf === "12345678910" ? "Gestor" : "Funcionário";
            
            const notificacao = {
                id: gerarId(),
                titulo: `Nova Mensagem do ${tipoRemetente}`,
                descricao: `Você recebeu uma nova mensagem: "${conteudo.substring(0, 50)}${conteudo.length > 50 ? '...' : ''}"`,
                destinatario: destinatarioChat.cpf,
                validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias
                status: "Pendente",
                tipoNotificacao: "Chat"
            };

            await fetch(`${API_URL}/notificacoes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(notificacao)
            });
        } catch (error) {
            console.error("Erro ao criar notificação:", error);
        }
    }

    function gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Limpar interval quando sair da página
    window.addEventListener('beforeunload', () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    });

    // Focar no input ao carregar a página
    if (mensagemInput) {
        mensagemInput.focus();
    }
});