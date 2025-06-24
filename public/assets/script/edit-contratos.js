
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    
    try {exibicaoContratoFuncionario();} catch(e){console.log("Erro na exibicaoContratosFuncionario", e)};
  try {exibicaoContrato();} catch(e){console.log("Erro na exibicaoContratos",e)};

  function tornarInativo()
  {
     fetch(`http://localhost:3000/contratos/${id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            ativo: false
          }),
        })
          .then((response) => response.json())
          .then((json) => {
          }).catch(console.error);
      }
  
    // Função que atualiza o json com a assinatura
    function assinarContrato()
    {
       fetch(`http://localhost:3000/contratos/${id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            assinado: true
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            window.location.href = "http://localhost:3000/contratos-exibicao-funcionario";
          }).catch(console.error);
      }
    
      // Função que exibe o contrato selecionado para o funcionário
    function exibicaoContratoFuncionario()
    {
      const container = document.getElementById('container-funcionario');
      fetch(`http://localhost:3000/contratos/?id=${id}`)
          .then((response) => response.json())
          .then((json) => {
            const contratos = json[0];
            container.innerHTML += 
            `<p>${contratos.nome}</p>
            <p>${contratos.email}</p>
            <p>${contratos.datanascimento}</p>
            <p>${contratos.cargo}</p>
            <p>${contratos.telefone}</p>
            <p id="verificacao"></p>
            <p></p>`

             verificarAssinatura();
        
            // Funcão que verifica se o contrato está assinado
            function verificarAssinatura()
        {
            const verificacao = document.getElementById('verificacao');

            if(contratos.assinado == false)
            {
              // Inserindo o botão de assinatura
                verificacao.innerHTML += `<button onclick="assinarContrato()">Assinar</button>`;
            }
            else
            {
              // Inserindo a confirmaçãode assinatura
                verificacao.className = 'assinado'
                verificacao.innerHTML += "Assinado";
            }
        }
          }).catch(console.error);
    }

    
    // Função que exibe o contrato específico para o gestor
    function exibicaoContrato()
    {
      const container = document.getElementById('container');

     fetch(`http://localhost:3000/contratos/?id=${id}`)
          .then((response) => response.json())
          .then((json) => {
            const contratos = json[0];
            container.innerHTML += 
            `<p>${contratos.nome}</p>
            <p>${contratos.email}</p>
            <p>${contratos.datanascimento}</p>
            <p>${contratos.cargo}</p>
            <p>${contratos.telefone}</p>
            <p id="verificacao"></p>
            <p></p>
            <button class="enviar" onclick="mostrarEdicao()">Editar</button>
            <button class="excluir" onclick="excluirContratos()">Excluir</button>`;

        verificarAssinatura();
        
            function verificarAssinatura()
        {
          // Verificando a assinatura e inserindo textos 
            const verificacao = document.getElementById('verificacao');

            if(contratos.assinado == false)
            {
                verificacao.className = 'nao-assinado';
                verificacao.innerHTML += "Não está assinado";
            }
            else
            {
                verificacao.className = 'assinado'
                verificacao.innerHTML += "Assinado";
            }
        }
          }).catch(console.error);
        }

      // Função que habilita a edição do contrato
          function mostrarEdicao()
          {
            fetch(`http://localhost:3000/contratos/?id=${id}`)
            .then((response) => response.json())
            .then((json) => {
                const contratos = json[0];
           
            container.innerHTML = 
            `
            <form id="editarContratos">
     <div>
        <label for="nome">Nome completo:</label>
        <input type="text" id="nome" disabled="true" value="${contratos.nome}">
     </div>
     <div>
        <label for="email">E-mail</label>
        <input type="email" id="email"disabled="true" value="${contratos.email}">
     </div>
     <div>
        <label for="telefone">Telefone:</label>
        <input type="tel" id="telefone" disabled="true" value="${contratos.telefone}">
     </div>
     <div>
        <label for="dtnasc">Data de Nascimento</label>
        <input type="date" id="dtnasc" disabled="true" value="${contratos.datanascimento}">
     </div>
     <div>
        <label for="cargo">Cargo</label>
        <input type="text" id="cargo" value="${contratos.cargo}">
     </div>
      <button class="inativar" onclick= "tornarInativo()"type="submit">Inativar</button>
      <button class="enviar" onclick= "editarContratos()"type="submit">Enviar</button>
      <button class="cancelar" onclick= "voltarPagina()"type="button">Cancelar</button>
            `
          }).catch(console.error);

        }
        // Função para voltar página
        function voltarPagina()
        {
          window.history.go(-1);
        }
        // Função que utiliza o fetch put para editar os contratos
        function editarContratos()
          {
            
            const form = document.getElementById('editarContratos');
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const telefone = document.getElementById('telefone');
        const dtnasc = document.getElementById('dtnasc');
        const cargo = document.getElementById('cargo');
         
  
        form.addEventListener("submit", e =>
        {
        e.preventDefault();
              
        fetch(`http://localhost:3000/contratos/${id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            userId: 1,
            nome: nome.value,
            email: email.value,
            telefone: telefone.value,
            dataNascimento: dtnasc.value,
            cargo: cargo.value
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            window.location.href = "http://localhost:3000/contratos-exibicao";
          }).catch(console.error);
      })}
