window.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const input = document.getElementById("senha");
    const botao = document.getElementById("enviar-senha");
    const entrada = document.getElementById("cep")
    const informacoes = document.getElementById("informacoes");

    entrada.onkeyup = function ()
    {
      var cep = parseInt(entrada.value);

      fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
  .then(response => response.json())
  .then(info => {
    console.log(info);
      informacoes.innerHTML = `
      <p>${info.state}</p>
                <p>${info.city}</p>
                <p>${info.neighborhood}</p>
                <p>${info.street}</p>
                  <label for="numero">Número</label>
                <input type="number" id="numero">
                <button id="atualizar">Atualizar</button>
                `;
        
      const botao = document.getElementById('atualizar');
      const numero = document.getElementById('numero');
      botao.onclick= function()
      {
               if(usuario.tipo == "Gestor")
    {
        fetch(`http://localhost:3000/gestores/${usuario.id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
           endereco: {
    cep: cep,
    rua: info.street,
    numero: numero.value,
    bairro: info.neighborhood,
    cidade: info.city,
    estado: info.state
  }
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            window.location.href = "http://localhost:3000/index";
          }).catch(console.error);
      }
      else if(usuario.tipo == "Funcionário")
      {
        fetch(`http://localhost:3000/funcionarios/${usuario.id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            endereco: {
    cep: cep,
    rua: info.street,
    numero: numero.value,
    bairro: info.neighbourhood,
    cidade: info.city,
    estado: info.state
  }
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            window.location.href = "http://localhost:3000/dashboard-funcionario";
          }).catch(console.error);
      }
        }
      
      
  });
    }


        botao.addEventListener("click", e =>
        {
            e.preventDefault();

             if(usuario.tipo == "Gestor")
    {
        fetch(`http://localhost:3000/gestores/${usuario.id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
           senha: input.value
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            window.location.href = "http://localhost:3000/index";
          }).catch(console.error);
      }
      else if(usuario.tipo == "Funcionário")
      {
        fetch(`http://localhost:3000/funcionarios/${usuario.id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
           senha: input.value
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            window.location.href = "http://localhost:3000/dashboard-funcionario";
          }).catch(console.error);
      }
        }
        )


   

    
})