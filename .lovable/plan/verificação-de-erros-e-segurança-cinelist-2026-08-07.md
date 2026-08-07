# Verificação de erros e segurança — CineList

## O que foi verificado agora

- **Console do app (preview local e site publicado)**: nenhum erro e nenhuma requisição falhando. Só aparecem mensagens informativas normais do ambiente de desenvolvimento (conexão do Vite e a dica do React DevTools).
- **Varredura de segurança do projeto** (banco, dependências, conectores): **0 achados** em todos os scanners.
- **Banco de dados**: a tabela de filmes tem RLS ativa com políticas que limitam ler/criar/editar/excluir apenas aos dados do próprio usuário.
- **Token do TMDB**: fica guardado como secret e é usado apenas no servidor — nunca chega ao navegador.

Conclusão: os "2 erros e 12 pontos de atenção" que você vê ao inspecionar a página **não vêm do seu aplicativo**. Eles são gerados pelo editor/preview da Lovable, que roda o app dentro de um iframe e adiciona seus próprios scripts. Abrindo o site publicado (`cinematecapessoal.lovable.app`) em uma aba normal, o console fica limpo.

## Melhorias opcionais de robustez (não são falhas)

1. **Limitar o endpoint público do TMDB**: as funções de servidor que buscam filmes populares e detalhes são públicas por natureza. Adicionar validação mais estrita do parâmetro `id` (inteiro positivo, faixa válida) evita chamadas malformadas.
2. **Evitar duplicados na watchlist**: hoje é possível adicionar o mesmo filme duas vezes. Uma restrição de unicidade por usuário + título/ano resolveria.
3. **Validação de formulário mais forte** no cadastro manual de filme (ano dentro de faixa válida, nota entre 0 e 10, URL de pôster válida).
4. **Proteção contra senhas vazadas** no login: ativar a checagem HIBP nas configurações de autenticação.

## Detalhes técnicos

- Verificação feita com Playwright headless em `http://localhost:8080/` e no domínio publicado, capturando `console`, `pageerror`, `requestfailed` e respostas HTTP >= 400.
- Nenhuma alteração de código foi feita nesta verificação.

Diga quais dos itens opcionais você quer que eu implemente (ou nenhum, se preferir manter como está).
