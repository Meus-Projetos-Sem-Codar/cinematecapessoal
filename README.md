# CineList

# CineList - Gestor de Filmes

## Objetivo

Permitir que usuÃ¡rios gerenciem sua lista de filmes para assistir, controlando status de visualização, notas e categorização.

## Telas

### Autenticação

**Rota:** `/`

**Objetivo:** Página inicial para login ou criação de conta no aplicativo.

**Componentes:**

- **Input Email**
- **Input Senha**
- **Botão Entrar**: Valida as credenciais e redireciona o usuário para a tela /movies.
- **Texto Criar Conta**: Alterna o formulário para modo de cadastro de novo usuário.

### Meus Filmes

**Rota:** `/movies`

**Objetivo:** Listagem principal de filmes do usuÃ¡rio com filtros e ações de gerenciamento.

**Componentes:**

- **Input Filtro Nome**: Filtra a lista de filmes em tempo real conforme o título digitado.
- **Select Filtro Categoria**: Filtra a exibição dos filmes baseado nas categorias selecionadas.
- **Botão Adicionar Filme**: Abre o modal de cadastro de novo filme.
- **Card de Filme**: Exibe Tí­tulo, Ano, Poster e Nota do filme cadastrado.
- **Checkbox Assistido**: Alterna o status do filme entre 'assistido' e 'não assistido' instantaneamente.
- **Botãoo Editar Filme**: Abre o modal de edição com os dados do filme preenchidos.
- **Botão Excluir Filme**: Abre um alerta de confirmação antes de remover o filme permanentemente.

### Modal Cadastro/Edição de Filme

**Rota:** `/movies/manage`

**Objetivo:** Formulário para inserir ou atualizar informações de um filme.

**Componentes:**

- **Input Tí­tulo**
- **Input Ano**
- **Input URL do Poster**
- **Multi-select Categorias**: Permite selecionar uma ou mais categorias pré-definidas para o filme.
- **Input Nota**
- **Botão Salvar**: Persiste os dados no banco e fecha o modal, atualizando a listagem principal.
- **Botão Cancelar**: Fecha o modal sem salvar as alterações.

Por enquanto não vamos conectar o banco de dados. Pode usar dados fictícios (mock).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cinematecapessoal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ba85de3d-6168-4082-8266-6540461eb83a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
