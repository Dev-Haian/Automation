<h1 align="center">Changelog</h1>

Todas as mudanças notáveis para este projeto serão documentadas neste arquivo.

O formato deste documento está baseado em: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.0.0] - 2025-MAI-14

### ADDED
- Implementação das seguintes automações:

| Aplicação 		| Automação 										| PATH
|-----					|-----													|-----
| Loja Virtual	| Financiamento Imobiliário			| **PATH**: `tests/apps/virtual-store/imobiliario/financiamento-imobiliario-pf.spec.ts`.
| Teddy360 			| Financiamento de Veículos PF 	| **PATH**: `tests/apps/teddy360/veiculos/financiamento/veiculos-leves-pf.spec.ts`.
| Teddy360			| Financiamento de Veículos PJ 	| **PATH**: `tests/apps/teddy360/veiculos/financiamento/veiculos-leves-pj.spec.ts`.
| Teddy360			| Veículos - Linha Verde PF 		| **PATH**: `tests/apps/teddy360/veiculos/financiamento/linha-verde-pf.spec.ts`.
| Teddy360			| Logout 												| **PATH**: `tests/apps/teddy360/logout/logout.spec.ts`.
| Teddy360			| Login 												| **PATH**: `tests/apps/teddy360/login/login.spec.ts`.
| Teddy360			| Financiamento Imobiliário 		| **PATH**: `tests/apps/teddy360/imobiliario/financiamento-imobiliario/financiamento-imobiliario.spec.ts`.
| Teddy360			| Empréstimos PF - INSS Cartões | **PATH**: `tests/apps/teddy360/emprestimos-pf/inss-cartoes.spec.ts`.
| Consig360			| Login 												| **PATH**: `tests/apps/consig360/login/login.spec.ts`.
| BackOffice		| Login 												| **PATH**: `tests/apps/back-office/login/login.spec.ts`.
| BackOffice		| Logout 												| **PATH**: `tests/apps/back-office/logout/logout.spec.ts`.

### CHANGED
- Todo o projeto foi refatorado e migrado para uma nova versão de pastas e arquivos
	- **PASTAS**:
		- apps/
			- audit/
			- back-office/
			- consig360/
			- teddy360/
			- virtual-store/
		- shared/
			- factories/
			- types/
			- utils/

## [1.2.2] - 2025-MAR-21

### ADDED
- Implementação da automação da jornada de Financiamento de Veículos Leves PJ;
	- **PATH**: `tests/web/veiculos/financiamento-veiculos-leves-pj.spec.ts`

### CHANGED
- Implementação de POO na ;

## [1.2.1] - 2025-MAR-14

### ADDED
- Implementação da automação da jornada de INSS Cartões (Empréstimos PF);
	- **PATH**: `tests/web/emprestimos-pf/inss-cartoes.spec.ts`

### CHANGED
- Inclusão SUT pattern nas automações (todas as automações devem seguir esse padrão);

## [1.2.0] - 2025-MAR-13

### CHANGED
- Migrar automação para V2 `test.steps()` do Playwight (todas as automações devem seguir essa estrutura);
- Implementar "Code Refactoring" no projeto;
- Refactoring do arquivo **setup.ts**;

## [1.0.0] - 2024-NOV-XX

### ADDED
- Implementação da V1 da jornada de financiamento de veículos leves;
- adição do arquivo **setup.ts** (para setup dos ambientes das automações);
