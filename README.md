# MicroManager

Sistema de gestão para microempreendedores alinhado com ODS 9 da ONU.

## Funcionalidades

- Cadastro de produtos
- Cadastro de clientes
- Gerenciamento de estoque
- Armazenamento local (localStorage)

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

## Docker

```bash
docker build -t microgestao .
docker run -p 8080:80 microgestao
```

Acesse http://localhost:8080

## Deploy

O app é automaticamente publicado no GitHub Pages ao fazer push na branch `main`:

https://leo-alvarenga.github.io/upx-5

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
