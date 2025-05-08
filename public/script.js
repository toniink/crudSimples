// Função para carregar usuários do backend e exibir na lista
function carregarUsuarios() {
    fetch("http://localhost:3000/usuarios")
        .then(response => response.json()) // Converte resposta para JSON
        .then(usuarios => {
            const lista = document.getElementById("lista");
            lista.innerHTML = ""; // Limpa a lista antes de atualizar

            usuarios.forEach(usuario => {
                // Criando elementos da lista de usuários com botões de edição e remoção
                const li = document.createElement("li");
                li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                li.innerHTML = `${usuario.nome}`;

                // Criando botão de edição
                const btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.classList.add("btn", "btn-warning", "btn-sm");
                btnEditar.onclick = () => editarUsuario(usuario.id, usuario.nome);

                // Criando botão de remoção
                const btnDeletar = document.createElement("button");
                btnDeletar.textContent = "Excluir";
                btnDeletar.classList.add("btn", "btn-danger", "btn-sm");
                btnDeletar.onclick = () => deletarUsuario(usuario.id);

                // Criando um container para os botões
                const divBotoes = document.createElement("div");
                divBotoes.appendChild(btnEditar);
                divBotoes.appendChild(btnDeletar);

                // Adicionando os botões à lista
                li.appendChild(divBotoes);
                lista.appendChild(li);
            });
        })
        .catch(error => console.error("Erro ao carregar usuários:", error));
}

// Função para salvar ou editar um usuário
document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const id = document.getElementById("id").value; // Obtém o ID oculto
    const nome = document.getElementById("nome").value; // Obtém o nome digitado
    const mensagem = document.getElementById("mensagem"); // Elemento de exibição de mensagem

    // Validação: não permitir envio com nome vazio
    if (!nome) {
        mensagem.textContent = "Por favor, digite um nome!";
        mensagem.style.color = "red";
        mensagem.style.display = "block";
        setTimeout(() => mensagem.style.display = "none", 3000);
        return;
    }

    // Determina se será um cadastro novo ou edição
    const url = id ? `http://localhost:3000/editar/${id}` : "http://localhost:3000/salvar";
    const metodo = id ? "PUT" : "POST";

    // Envia a requisição para o backend
    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
    })
        .then(response => response.json())
        .then(data => {
            // Exibe mensagem de sucesso
            mensagem.textContent = data.mensagem;
            mensagem.style.color = "green";
            mensagem.style.display = "block";
            setTimeout(() => mensagem.style.display = "none", 3000);

            // Limpa os campos do formulário
            document.getElementById("id").value = "";
            document.getElementById("nome").value = "";

            // Atualiza a lista de usuários
            carregarUsuarios();
        })
        .catch(error => console.error("Erro ao salvar:", error));
});

// Função para carregar os dados do usuário no formulário ao editar
function editarUsuario(id, nome) {
    document.getElementById("id").value = id;
    document.getElementById("nome").value = nome;
}

// Função para remover um usuário
function deletarUsuario(id) {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
        fetch(`http://localhost:3000/deletar/${id}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                alert(data.mensagem);
                carregarUsuarios(); // Atualiza lista após remoção
            })
            .catch(error => console.error("Erro ao remover usuário:", error));
    }
}

// Chama a função para carregar os usuários assim que a página carregar
carregarUsuarios();