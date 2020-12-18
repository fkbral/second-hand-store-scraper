# Web Scraping

## Como consumir recursos de outros sites/plataformas para utilizar em nosso sistema?

Através de **requisições http**.

Browser:
```js
fetch('https://api.github.com/users/fkbral')
.then(data => data.json())
.then(json => console.log(json));

fetch('https://www.google.com').then(data => console.log(data));

fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: 'foo',
      body: 'bar',
      userId: 1
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then(json => console.log(json));

fetch('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'PATCH',
  body: JSON.stringify({
    title: 'Novo Título'
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})
.then(response => response.json())
.then(json => console.log(json));
```

Terminal:
```sh
curl https://api.github.com/users/fkbral
curl https://www.google.com
curl -X POST -H "Content-Type: application/json" \
-d '{"title": "título da postagem", "body": "meu texto", "userId" : 1}' \
    https://jsonplaceholder.typicode.com/posts
```

### Alguns tipos

- APIs públicas REST: https://api.github.com/users/fkbral
- Feeds RSS: https://trends.google.com/trends/hottrends/atom/hourly
- Web Scraping

## O que é?
Forma de garimpar informações em sites de maneira automatizada.

## O que vamos construir?
Uma agregador de resultados de buscas para produtos usados.

## Tópicos a abordar e tarefas
- [] Iniciar projeto Node.js
- [] Configurar TypeScript
  - [] iniciar tsconfig.json
  - [] ts-node --transpile-only src/index.ts
- [] Incluir scripts para build no package.json
- [] Iniciar Puppeteer
  - [] Navegação headfull
- [] Fazer estrutura dos provedores para busca
  - [] Provedor: url, nome, lista de seletores e separador
  - [] Produto: nome, imagem, url, preço, origem
  - [] Seletores: container da lista, container do produto, imagem, título, preço, imagem
- [] Identificar seletores no DOM para capturar as informações desejadas
- [] Resgatar informações das páginas web
- [] Prompt ao usuário sobre termo de busca
- [] Salvar resultado da pesquisa em disco

## Desafios
- [] Servidor de desenvolvimento
  - [] Criar servidor express para servir aplicação
  - [] tsnd --transpile-only --ignore-watch node_modules --respawn src/server.ts
- [] Conectar com um frontend web
- [] Salvar imagens no servidor
- [] Adicionar input para pesquisa de produtos no frontend
