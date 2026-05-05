# Backend TCC

API em Nest.js com TypeORM e MySQL para o sistema de contribuintes e financeiro.

## Como rodar

```bash
npm install
npm run start:dev
```

Por padrao o backend usa:

```env
APP_PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=tcc
DB_SYNCHRONIZE=false
DB_MIGRATIONS_RUN=false
```

O backend cria o banco `tcc` automaticamente se o usuario MySQL tiver permissao. As tabelas sao controladas por migrations.

## Migrations

Rodar migrations pendentes:

```bash
npm run migration:run
```

Ver migrations executadas/pendentes:

```bash
npm run migration:show
```

Reverter a ultima migration:

```bash
npm run migration:revert
```

Criar uma migration vazia para escrever manualmente:

```bash
npm run migration:create -- src/database/migrations/NomeDaMigration
```

Gerar migration a partir das entidades:

```bash
npm run migration:generate
```

Em producao, mantenha `DB_SYNCHRONIZE=false`. Se quiser que a aplicacao rode migrations automaticamente ao iniciar, use `DB_MIGRATIONS_RUN=true`; para desenvolvimento, prefira `npm run migration:run` para ter controle explicito.

## Rotas principais

- `POST /api/auth/login`
- `GET|POST /api/usuarios`
- `GET|POST /api/contribuintes`
- `GET /api/contribuintes/aniversariantes?mes=5`
- `GET|POST /api/profissoes`
- `GET|POST /api/contribuicoes`
- `GET|POST /api/categorias-despesa`
- `GET|POST /api/despesas`
- `GET|POST /api/ofertas`
- `GET /api/dashboard?ano=2026&mes=5`
- `GET /api/relatorios?tipo=contribuicoes&inicio=2026-05-01&fim=2026-05-31`

## Observacoes de modelagem

- Valores financeiros usam `decimal(10,2)` em vez de `double`.
- `contribuinte_contribuicao` foi mantida como tabela de relacionamento.
- `usuario_despesa` foi mantida para permitir mais de um usuario associado a uma despesa.
- `oferta` foi adicionada porque ja existe no fluxo do frontend.
- Senhas de usuarios sao salvas com hash `bcrypt`.
- A migration `SeedAdminUser` cria um usuario inicial para desenvolvimento:
  - usuario: `admin`
  - senha: `admin123`
