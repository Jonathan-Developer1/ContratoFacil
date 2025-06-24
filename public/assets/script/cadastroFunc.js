const apiUrl = 'http://localhost:3000/funcionarios';

const form = document.getElementById('formFuncionario');
const tbody = document.getElementById('listaFuncionarios');
const inputId = document.getElementById('id');

function formatarData(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function validarFormulario(nome, cpf, email, senha, telefone, dataNascimento) {
  if (!nome.trim()) {
    alert('Por favor, preencha o nome.');
    return false;
  }
   if (!cpf.trim()) {
    alert('Por favor, preencha o cpf.');
    return false;
  }
  if (!email.trim() || !email.includes('@')) {
    alert('Por favor, preencha um email válido.');
    return false;
  }
 if (!senha.trim()) {
    alert('Por favor, preencha o senha.');
    return false;
  }
  if (!telefone.trim()) {
    alert('Por favor, preencha o telefone.');
    return false;
  }
  if (!dataNascimento.trim()) {
    alert('Por favor, preencha a data de nascimento.');
    return false;
  }
  return true;
}

function limparFormulario() {
  form.reset();
  inputId.value = '';
}

function carregarFuncionarios() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('Erro ao carregar funcionários.');
      return response.json();
    })
    .then(funcionarios => {
      tbody.innerHTML = '';

      funcionarios.forEach((funcionario, index) => {
        const tr = document.createElement('tr');

        if (index % 2 === 0) {
          tr.style.backgroundColor = '#f9f9f9';
        } else {
          tr.style.backgroundColor = '#ffffff';
        }

        tr.innerHTML = `
          <td>${funcionario.nome}</td>
          <td>${funcionario.cpf}</td>
          <td>${funcionario.email}</td>
          <td>${funcionario.senha}</td>
          <td>${funcionario.telefone}</td>
          <td>${formatarData(funcionario.dataNascimento)}</td>
          <td>${funcionario.tipo}</td>
          <td class="acoes">
            <button class="btn-edit" data-id="${funcionario.id}">Editar</button>
            <button class="btn-delete" data-id="${funcionario.id}">Excluir</button>
          </td>
        `;

        tbody.appendChild(tr);
      });

      adicionarEventosBotoes();
    })
}

function adicionarEventosBotoes() {
  const botoesEditar = document.querySelectorAll('.btn-edit');
  const botoesExcluir = document.querySelectorAll('.btn-delete');

  botoesEditar.forEach(botao => {
    botao.addEventListener('click', () => {
      const id = botao.getAttribute('data-id');
      editarFuncionario(id);
    });
  });

  botoesExcluir.forEach(botao => {
    botao.addEventListener('click', () => {
      const id = botao.getAttribute('data-id');
      excluirFuncionario(id);
    });
  });
}

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const telefone = document.getElementById('tel').value;
  const dataNascimento = document.getElementById('data').value;
  const tipo = document.getElementById('tipo').value;
  const id = inputId.value;

  if (!validarFormulario(nome, cpf, email, senha, telefone, dataNascimento)) return;

  const funcionario = {
    nome,
    cpf,
    email,
    senha,
    telefone,
    dataNascimento,
    tipo
  };

  if (id) {
    // atualizar
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(funcionario)
    })
      .then(response => {
        if (!response.ok) throw new Error('Erro ao atualizar funcionário.');
        return response.json();
      })
      .then(() => {
        alert('Funcionário atualizado com sucesso!');
        limparFormulario();
        carregarFuncionarios();
      })
      .catch(error => alert(error.message));
  } else {
    // criar novo - com id sequencial em string
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error('Erro ao carregar funcionários para gerar ID.');
        return response.json();
      })
      .then(funcionarios => {
        let maiorId = 0;
        funcionarios.forEach(f => {
          const idNum = Number(f.id);
          if (!isNaN(idNum) && idNum > maiorId) {
            maiorId = idNum;
          }
        });
        funcionario.id = String(maiorId + 1); // id sequencial em string

        return fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(funcionario)
        });
      })
      .then(response => {
        if (!response.ok) throw new Error('Erro ao cadastrar funcionário.');
        return response.json();
      })
      .then(() => {
        alert('Funcionário cadastrado com sucesso!');
        limparFormulario();
        carregarFuncionarios();
      })
      .catch(error => alert(error.message));
  }
});

function editarFuncionario(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => {
      if (!response.ok) throw new Error('Funcionário não encontrado.');
      return response.json();
    })
    .then(funcionario => {
      inputId.value = funcionario.id;
      document.getElementById('nome').value = funcionario.nome;
      document.getElementById('cpf').value = funcionario.cpf;
      document.getElementById('email').value = funcionario.email;
      document.getElementById('senha').value = funcionario.senha;
      document.getElementById('tel').value = funcionario.telefone;
      document.getElementById('data').value = funcionario.dataNascimento;
      document.getElementById('tipo').value = funcionario.tipo;

    })
    .catch(error => alert(error.message));
}

function excluirFuncionario(id) {
  if (confirm('Tem certeza que deseja excluir este funcionário?')) {
    fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) throw new Error('Erro ao excluir funcionário.');
        carregarFuncionarios();
      })
      .catch(error => alert(error.message));
  }
}

carregarFuncionarios()
