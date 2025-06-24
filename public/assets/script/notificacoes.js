// Função para renderizar a tabela de notificações
function renderizarTabela(lista) {
  const tabela = document.getElementById('lista-notificacoes');
  tabela.innerHTML = '';

  if (lista.length === 0) {
    tabela.innerHTML = '<tr><td colspan="5">Nenhuma notificação encontrada.</td></tr>';
    return;
  }

  lista.forEach(n => {
    const descricaoPreview = n.descricao.length > 30
      ? n.descricao.slice(0, 30) + '...'
      : n.descricao;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${n.titulo || 'Sem título'}</td>
      <td>${descricaoPreview}</td>
      <td>${n.validade || '-'}</td>
      <td>${n.status || 'Pendente'}</td>
      <td>
        <button class="editar" data-id="${n.id}">✏️</button>
        <button class="excluir" data-id="${n.id}">🗑️</button>
      </td>
    `;
    tabela.appendChild(tr);
  });

  adicionarEventos(); // Adiciona os eventos após renderizar
}

// Função principal para carregar e exibir notificações
async function carregarNotificacoes() {
  try {
    const resposta = await fetch('https://meu-back-contratofacil-production.up.railway.app/api/notificacoes');
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

    const notificacoes = await resposta.json();
    renderizarTabela(notificacoes); // Exibe a tabela completa inicialmente

    // ============================
    // Campo de busca dinâmica
    // ============================
    const campoBusca = document.getElementById('pesquisar');
    campoBusca.addEventListener('input', () => {
      const termo = campoBusca.value.toLowerCase();
      const filtradas = notificacoes.filter(n =>
        n.titulo.toLowerCase().includes(termo) ||
        n.descricao.toLowerCase().includes(termo) ||
        n.status.toLowerCase().includes(termo)
      );
      renderizarTabela(filtradas); // Atualiza a tabela com os resultados filtrados
    });

  } catch (erro) {
    console.error('Erro ao buscar notificações:', erro);
    const tabela = document.getElementById('lista-notificacoes');
    tabela.innerHTML = '<tr><td colspan="5">Erro ao carregar notificações.</td></tr>';
  }
}

// Adiciona os eventos nos botões de excluir e editar
function adicionarEventos() {
  // Botão de excluir
  document.querySelectorAll('.excluir').forEach(botao => {
    botao.addEventListener('click', async () => {
      const id = botao.getAttribute('data-id');
      const confirmar = confirm('Tem certeza que deseja excluir esta notificação?');
      if (confirmar) {
        await fetch(`https://meu-back-contratofacil-production.up.railway.app/api/notificacoes/${id}`, {
          method: 'DELETE',
        });
        carregarNotificacoes(); // Recarrega a lista
      }
    });
  });

  // Botão de editar
  document.querySelectorAll('.editar').forEach(botao => {
    botao.addEventListener('click', () => {
      const id = botao.getAttribute('data-id');
      localStorage.setItem('editando', id);
      window.location.href = 'criar.html';
    });
  });
}

// Inicia o carregamento ao abrir a página
carregarNotificacoes();
