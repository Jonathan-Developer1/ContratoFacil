 try{ preencherInput();}catch{console.log("Erro em preencherInput", e)};
 
 
 
 function preencherInput()
         {
          // Essa função é usada para preencher os inputs automaticamente com dados que vem do json de funcionários
            const params = new URLSearchParams(window.location.search);
            const id = parseInt(params.get('id'));
             const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const telefone = document.getElementById('telefone');
        const dtnasc = document.getElementById('dtnasc');
        var idFuncionario;

         fetch(`https://meu-back-contratofacil-production.up.railway.app/api/funcionarios/?id=${id}`)
        .then((response) => response.json())
          .then((json) => {
            json[0];
            nome.value = json[0].nome;
             email.value = json[0].email;
             telefone.value = json[0].email;
             dtnasc.value = json[0].dataNascimento;
             
             
          })
        
         }
        
        
// Função de post enviando os dados para o json de contratos
        function postarContratos()
        {
             const form = document.getElementById('enviarContratos');
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const telefone = document.getElementById('telefone');
        const dtnasc = document.getElementById('dtnasc');
        const cargo = document.getElementById('cargo');
        const tipo = document.getElementById('tipo');



        form.addEventListener("submit", e =>
        {
        e.preventDefault();

         const params = new URLSearchParams(window.location.search);
            const id = parseInt(params.get('id'));
        fetch(`https://meu-back-contratofacil-production.up.railway.app/api/funcionarios/?id=${id}`)
        .then((response) => response.json())
          .then((json) => {
             const idFuncionario = json[0].id;
             const cpf = json[0].cpf;
          
        
        fetch("https://meu-back-contratofacil-production.up.railway.app/api/contratos", 
         {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            userId: 1,
            idFuncionario: idFuncionario,
            nome: nome.value,
            email: email.value,
            telefone: telefone.value,
            cpf: cpf,
            datanascimento: dtnasc.value,
            cargo: cargo.value,
            tipo: tipo.value,
            assinado: false,
            ativo: true
          }),
        
        })
        .then((response) => response.json())
          .then((json) => {
            window.location.href = form.action;
            console.log(json);})
            
        })
      })};
          