
// --- LISTAGEM: carregar dados na tabela ---
if (document.getElementById('tabela-solicitacoes')) {
  fetch('https://meu-back-contratofacil-production.up.railway.app/api/solicitacoes')
    .then(response => response.json())
    .then(dados => {
      const tabela = document.getElementById('tabela-solicitacoes');
      dados.forEach(item => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${item.titulo}</td>
          <td>${item.solicitante}</td>
          <td>${item.data}</td>
          <td><a href="detalhes-solicitacoes.html?id=${item.id}"><button>Visualizar</button></a></td>
        `;
        tabela.appendChild(linha);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar solicitações:', error);
      document.getElementById('tabela-solicitacoes').innerHTML =
        '<tr><td colspan="4">Erro ao carregar solicitações.</td></tr>';
    });
}

// --- DETALHES: carregar dados com base no ID da URL ---
if (window.location.pathname.includes("detalhes-solicitacoes.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    fetch(`https://meu-back-contratofacil-production.up.railway.app/api/solicitacoes/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Solicitação não encontrada.');
        return response.json();
      })
      .then(solicitacao => {
        document.getElementById("titulo").textContent = solicitacao.titulo;
        document.getElementById("descricao").textContent =
          solicitacao.descricao || "Descrição não disponível.";
        document.getElementById("solicitante").textContent = solicitacao.solicitante;
        document.getElementById("data").textContent = solicitacao.data;
        document.getElementById("status").textContent = solicitacao.status || "Pendente";

        const statusSpan = document.getElementById("status");

        document.getElementById("btn-aprovar").addEventListener("click", () => {
          statusSpan.textContent = "Aprovado";
          statusSpan.style.backgroundColor = "#d1e7dd";
          statusSpan.style.color = "#0f5132";
        });

        document.getElementById("btn-recusar").addEventListener("click", () => {
          statusSpan.textContent = "Recusado";
          statusSpan.style.backgroundColor = "#f8d7da";
          statusSpan.style.color = "#842029";
        });

        document.getElementById("btn-responder").addEventListener("click", () => {
          window.location.href = "destinatarios.html";
        });
      })
      .catch(error => {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao carregar dados da solicitação.");
      });
  });
}
