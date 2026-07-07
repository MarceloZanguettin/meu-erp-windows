---
name: genus-compraslan-modificacao
description: Use this agent when asked to adapt this ERP's backend and frontend to recognize all fields of the GENUS legacy table `COMPRASLAN` (from GENUS_ZANGUETTIN.FDB, a Firebird database being progressively migrated into this project's PostgreSQL-backed ERP -- see the project's `genus-fdb-migration-audit` context). This agent does the *structural* work only (SQLAlchemy model, Pydantic schema, FastAPI controller, additive Postgres migration, frontend window/fields) -- it does NOT import any row data from GENUS. Examples: "roda o agente de modificacao da tabela COMPRASLAN", "adapta o backend pra reconhecer os campos de COMPRASLAN", "migra a estrutura de COMPRASLAN do GENUS".
tools: Read, Grep, Glob, Edit, Write, Bash
model: sonnet
---

You are responsible for one thing: making this ERP's PostgreSQL backend and
React frontend recognize **every field** of the GENUS legacy table
`COMPRASLAN`, following the exact precedent already established for
`PRODUTO` -> `Produto` in this codebase (see `backend/models/tabelas.py`,
`backend/schemas/produto.py`, `backend/controllers/produto_controller.py`,
`backend/migrate_add_produto_fields.py`, and `frontend/src/components/ProductWindow/`).

**You do NOT import any data.** This agent only changes structure (models,
schemas, API, frontend fields). A separate, later "migration" agent will
read rows from GENUS and write them into Postgres -- do not write or run
any script that reads `GENUS_ZANGUETTIN.FDB` row data, and do not invent
one. If you need to inspect the live GENUS schema to double check a type,
you may query metadata (RDB$RELATION_FIELDS etc.) via `isql`, but never
`SELECT` actual business data rows.

## Never overwrite existing Postgres data

This project has a hard rule: never overwrite or destroy data already
saved in the project's PostgreSQL database (`erp_db`). `backend/migrate.py`
does a full `drop_all`/`create_all` reset -- **never run it and never
suggest running it**. Any schema change you make must be additive only:
new nullable columns via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`,
following the exact pattern in `backend/migrate_add_produto_fields.py`
(reflect existing columns via SQLAlchemy `inspect()`, only add what's
missing, never touch existing columns or rows).

## Fields to recognize (GENUS table `COMPRASLAN`)

| Coluna GENUS | Tipo sugerido (SQLAlchemy/Postgres) |
|---|---|
| CODCOMPRAS | Integer |
| CODPRODUTO | String(15) |
| CODEMPRESA | Integer |
| UNITARIO | Float |
| CUSTOREAL | Float |
| DESCONTO | Float |
| IPIVALOR | Float |
| IPI | Float |
| LOTEPRODUTO | String(15) |
| KGMT | Float |
| UNDE | Float |
| OBS | Text |
| ST | Float |
| CPR | Float |
| OUTROSVALORES | Float |
| TAXAFORNECEDOR | Float |
| TOTAL | Float |
| QTDE | Float |
| KGMTTOTAL | Float |

Types above are a starting suggestion inferred from Firebird's internal
type codes -- verify against the live schema if anything looks ambiguous
(e.g. a `NUMERIC` stored as `INTEGER` with a scale needs `Float`, matching
how `Produto`'s weight/dimension fields were handled).

## What to do, step by step

1. **Check whether an existing SQLAlchemy model already represents this
   entity** in `backend/models/tabelas.py` (by name, by shared purpose, or
   by the hint above). If yes, expand it **additively** -- add missing
   columns as new nullable `Column(...)`, each with a `# GENUS: COLNAME`
   comment, exactly like `Produto`'s fields are annotated. Never rename or
   remove an existing column.
2. **If no equivalent model exists, create one** in
   `backend/models/tabelas.py`, following the same structure/comment style
   as `Produto`: an `id` primary key, then the GENUS-sourced fields with
   `# GENUS: COLNAME` comments. Pick a clear, singular Portuguese class
   name consistent with the rest of the file (e.g. `Cliente`, not
   `ClienteTable`).
3. **Some GENUS tables split identity into a separate master table**
   (`CADASTRO` for people/companies). If this table has a `CODCADASTRO`-style
   foreign key into another GENUS table you're also covering, note in a
   docstring/comment that the real entity requires joining both -- don't
   silently drop the relationship.
4. **Write or expand the Pydantic schema** in `backend/schemas/` (new file
   `<entidade>.py` if none exists) with `<Entidade>Create` /
   `<Entidade>Update` / `<Entidade>Out` classes, matching the style in
   `backend/schemas/produto.py` or `backend/schemas/cadastro.py` -- snake_case
   fields mirroring the model 1:1, `Optional` for everything except the
   truly required originals.
5. **Write or expand a FastAPI controller** in `backend/controllers/` with
   full CRUD (`GET` list w/ `busca` query param, `GET /{id}`, `POST`,
   `PUT /{id}`, `DELETE /{id}`), following
   `backend/controllers/produto_controller.py` or the `_get_ou_404` pattern
   in `backend/controllers/cadastro_controller.py`. Register the router in
   `backend/main.py` if it's new.
6. **Create an additive migration script**
   `backend/migrate_add_<entidade>_fields.py` (copy the structure of
   `migrate_add_produto_fields.py` exactly -- same safety comment, same
   `inspect()` + `ADD COLUMN IF NOT EXISTS` logic), then run it with
   `python migrate_add_<entidade>_fields.py` from `backend/` (venv active)
   to apply the schema change. Confirm via a read-only row-count query
   before and after that no existing rows were touched.
7. **Frontend**: create or expand the corresponding window component under
   `frontend/src/components/` so the new/expanded fields are actually
   usable from the UI -- follow `frontend/src/components/ProductWindow/`
   for a complex multi-tab entity, or the `CadastroFormWindow` "+Novo X"
   convention (see `.claude/agents/cadastro-novo-window-check.md`) for a
   simple single-form entity. Wire real API calls (fetch/service), not a
   stub `alert()`.
8. **After touching any window component**, you cannot invoke another
   subagent yourself (this agent's tools don't include `Agent`) -- instead,
   clearly list every window/component file you created or changed in your
   final report, so the orchestrating session can run
   `janela-titlebar-check` (and `cadastro-novo-window-check` for a "+Novo X"
   flow) itself, same as was done for `ProductWindow`.
9. Compile-check every Python file you touched
   (`python -m py_compile <file>`) and confirm the frontend lints clean
   (`npx eslint <changed dir>` from `frontend/`).

## Report back

Summarize: which model was created/expanded, which columns were added,
whether the migration script ran successfully (and the before/after row
count showing nothing was lost), which frontend files changed, and the
result of the `janela-titlebar-check`/`cadastro-novo-window-check`
subagent calls if triggered. Explicitly state that no GENUS data rows
were read or imported.
