window.addEventListener('DOMContentLoaded', () => {

   
 const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
      console.log(usuario);

    // Quando a página carregar, essas funções serão chamadas
     try { exibirContratos(); } catch (e) { console.error("Erro em exibirContratos:", e); }
    try { pesquisaFuncionarios(); } catch (e) { console.error("Erro em pesquisaFuncionarios:", e); }
    try { exibicaoContratos(); } catch (e) { console.error("Erro em exibicaoContratos:", e); }
    try { pesquisaContratos(); } catch (e) { console.error("Erro em pesquisaContratos:", e); }
    try { exibirContratosFuncionario(); } catch (e) { console.error("Erro em exibirContratosFuncionario:", e); }
    try { exibicaoContratosFuncionario(); } catch (e) { console.error("Erro em exibicaoContratosFuncionario:", e); }
    try { exibeNome(); } catch (e) { console.error("Erro em exibeNome:", e); }

    
    //   Confere se o usuário está logado
    if (!usuario) {
        alert("Faça login para continuar.");
        window.location.href = "login.html";
        return;
    }
            


// Função que exibe os contratos na página dos funcionários
function exibirContratosFuncionario()
{
    
    const lista = document.getElementById('lista-contrato-funcionario');

    fetch("https://meu-back-contratofacil-production.up.railway.app/api/contratos")
    .then((response) => response.json())
    .then((json) =>
    {
        json.forEach(contratos =>
    {
      
        // Confere se os cpfs são iguais
        if(usuario.cpf == contratos.cpf)
        {
            
             lista.innerHTML += `<tr class="elementos-lista">
                            <td>${contratos.nome}</td>
                            <td>${contratos.cargo}</td>
                            <td>${contratos.tipo}</td>
                            <td><a href="detalhe-contratos-funcionario.html?id=${contratos.id}">Ver</a></td>
                        </tr>`;
        }
    })
    })
}

// Função que exibe todos os contratos para o gestor
    function exibirContratos()
   { 
    
    
    const lista = document.getElementById('lista-contratos');
    tipo = document.getElementById('tipo');
    tipo.addEventListener('change', exibirContratos);

    ativos = document.getElementById('ativos');
    lista.innerHTML = "";
   

    fetch("https://meu-back-contratofacil-production.up.railway.app/api/contratos")
    .then((response) => response.json())
    .then((json) =>
    {
        json.forEach(contratos => 
        {
        
        //   Verificando o tipo de cada contrato
          if(contratos.tipo == tipo.value)
          {
            if(tipo.value == "Admissional")
            {
                ativos.style.visibility = "visible";
            }
             statusAtivo.addEventListener('change', exibirContratos);
            if(statusAtivo.value == "Inativo" && contratos.ativo == false)
            {
                lista.innerHTML += `<tr class="elementos-lista">
                            <td>${contratos.nome}</td>
                            <td>${contratos.cargo}</td>
                            <td>${contratos.tipo}</td>
                            <td><a href="detalhe-contratos.html?id=${contratos.id}">Editar</a></td>
                        </tr>`;
            }
            else if(statusAtivo.value == "Ativo" && contratos.ativo == true)
            {
             lista.innerHTML += `<tr class="elementos-lista">
                            <td>${contratos.nome}</td>
                            <td>${contratos.cargo}</td>
                            <td>${contratos.tipo}</td>
                            <td><a href="detalhe-contratos.html?id=${contratos.id}">Editar</a></td>
                        </tr>`;
            }
            
          }
        });

    });
}

// Função que pesquisa os contratos
function pesquisaContratos()
{
    const entrada = document.getElementById('pesquisar-contratos');
    
    entrada.onkeyup = function()
    {
        const termo = entrada.value.toLowerCase().trim();
        var itens = document.getElementsByClassName("elementos-lista");

            for (var i = 0; i < itens.length; i++) {
                var item = itens[i].innerHTML;
                
                if (item.toLowerCase().includes(termo))
                    itens[i].style.display = "";
                else
                itens[i].style.display = "none";
            }
    }
}

// Função que pesquisa os funcionários existentes para envio do contrato
function pesquisaFuncionarios()
{
    const botao = document.getElementById('botaoEnvio');
    const lista = document.getElementById('lista-funcionario');
    
    botao.addEventListener("click", (e) =>
    {
        
        e.preventDefault();
        
        const entrada = document.getElementById('pesquisar-funcionarios');
    
        const termo = entrada.value.toLowerCase().trim();
        console.log(termo)
        
        fetch("https://meu-back-contratofacil-production.up.railway.app/api/funcionarios")
        .then((response) => response.json())
        .then((json) =>
        { 
            
            console.log(json);
            json.forEach(func => 
            {
                if(func.nome.toLowerCase().includes(termo))
                {
                  lista.innerHTML += `
                    <tr>
                            <td>${func.nome}</td>
                            <td>${func.email}</td>
                            <td><a href="contrato.html?id=${func.id}">Enviar</a></td>
                        </tr>
                        </tbody>`;
                }
            }
        )
        }
     )})
}

// Função que muda elementos de exibição no index
function exibicaoContratos()
{
  var ultimosContratos;
  const lista = document.getElementById('lista');
  const contagem = document.getElementById('contagem');
  var contador = 0;

  fetch("https://meu-back-contratofacil-production.up.railway.app/api/contratos")
    .then((response) => response.json())
    .then((json) =>
    {
        json.forEach(contratos => 
        {
          {
            contador++;
            ultimosContratos = json.reverse().slice(0,5);
            
          }
        });
        ultimosContratos.forEach(contratos =>
        {
            lista.innerHTML += `<tr>
                            <td>${contratos.nome}</td>
                            <td>${contratos.cargo}</td>
                            <td>${contratos.tipo}</td>
                            <td><a href="detalhe-contratos.html?id=${contratos.id}">Editar</a></td>
                        </tr>`;
    });

    contagem.innerHTML += `${contador}`;
})
}
// Função que muda elementos de exibição para o funcionário
function exibicaoContratosFuncionario()
{
    const lista = document.getElementById('lista-funcionario');
        

    fetch("https://meu-back-contratofacil-production.up.railway.app/api/contratos")
    .then((response) => response.json())
    .then((json) =>
    {
        json.forEach(function(contratos)
    {
        if(usuario.tipo == "Funcionário" && usuario.cpf == contratos.cpf)
        {
            lista.innerHTML += `<tr>
                            <td>${contratos.nome}</td>
                            <td>${contratos.cargo}</td>
                            <td>${contratos.tipo}</td>
                            <td><a href="detalhe-contratos-funcionario.html?id=${contratos.id}">Ver</a></td>
                        </tr>`;
        }
        })
    })
    
}
// Função que exibe os nomes dos usuários na tela
function exibeNome()
{
    const nomeU = document.getElementById('nome-usuario');
    nomeU.innerHTML = usuario.nome;

}
    

})
