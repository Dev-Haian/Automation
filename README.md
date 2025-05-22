<h1 align="center">QA Automation</h1>

<h3>Estrutura de pastas</h3>

- tests/
	- apps/
		- audit/
		- back-office/
		- consig360/
		- teddy360/
		- virtual-store/
	- shared/
		- factories/
		- fixtures/
		- logs/
		- types/
		- utils/

<h3>Responsividade</h3>

| Tela 		|	Resolução			| Porcentagem	|
|-----		|-----					|-----				|
| Large 	|	(1920x1080)		|	100%, 125%	|
| Small 	|	(1366x768)		|	100%, 125%	|
| Tablet 	| (768x1024)		|	100%				|
| Mobile 	| (390x844)			|	100%				|

<h3>GitHub Actions</h3>

Crie este arquivo neste caminho: `.github/workflows/playwright.yml`.

```YML
name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install only Chromium with dependencies
      run: npx playwright install --with-deps chromium
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30

```

**NOTA**: O motivo deste repo estar sem as actions é temporário, mas envolve custos.

<p align="center">Feito c/ 🧡 pelos QA's</p>
