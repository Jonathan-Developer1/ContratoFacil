// Função que exclui os contratos, é chamada pelo botão excluir
      function excluirContratos()
      {
         fetch(`http://localhost:3000/contratos/${id}`, {
          method: "DELETE"
         }).then((response) => response.json())
         .then((json) => {
          window.location.href = "http://localhost:3000/contratos-exibicao";
         }).catch(console.error);
      }
          