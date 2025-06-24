// Função que exclui os contratos, é chamada pelo botão excluir
      function excluirContratos()
      {
         fetch(`https://meu-back-contratofacil-production.up.railway.app/api/contratos/${id}`, {
          method: "DELETE"
         }).then((response) => response.json())
         .then((json) => {
          window.location.href = "https://meu-back-contratofacil-production.up.railway.app/api/contratos-exibicao";
         }).catch(console.error);
      }
          