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
- `profissao` e `contribuinte` possuem relacao N:N pela tabela `profissao_contribuinte`.
- O cadastro de contribuinte recebe `profissaoIds`; a tela atual envia uma profissao, mas a API suporta varias.
- `contribuinte` nao possui relacionamento com `usuario`.
- Cada `contribuicao` referencia diretamente um contribuinte por `fk_id_contribuinte`.
- Cada `despesa` referencia diretamente o usuario que a registrou por `fk_id_usuario`.
- `oferta` foi adicionada porque ja existe no fluxo do frontend.
- Senhas de usuarios sao salvas com hash `bcrypt`.
- A migration `SeedAdminUser` cria um usuario inicial para desenvolvimento:
  - usuario: `admin`
  - senha: `admin123`

## Importacao da CBO

A tabela `profissao` possui o campo unico `codigo_cbo`. A API disponibiliza
somente ocupacoes oficiais importadas e nao permite cadastro, edicao ou exclusao
manual de profissoes.

1. Baixe a relacao oficial de ocupacoes no portal da CBO do Ministerio do
   Trabalho e Emprego.
2. Salve o CSV em `data/cbo/cbo-ocupacoes.csv`.
3. Execute:

```bash
npm run profissao:import
```

Para importar outro caminho:

```bash
npm run profissao:import -- C:/caminho/cbo.csv
```

O importador:

- aceita separador `;` ou `,`;
- normaliza o codigo para o formato `0000-00`;
- insere novas ocupacoes;
- atualiza nomes de codigos existentes;
- nao duplica dados quando executado novamente;
- informa quantos registros foram inseridos, atualizados, ignorados ou invalidos.
- aceita arquivos UTF-8 e Windows-1252.

Profissoes antigas sem codigo CBO e sem vinculos sao removidas por migration.
Registros antigos ainda vinculados a contribuintes ficam apenas como legado e
nao aparecem na busca; devem ser substituidos por uma ocupacao oficial.

A busca usada pela combobox e feita por nome ou codigo:

```http
GET /api/profissoes?search=enferm&limit=20
```
