import type { Page } from "@playwright/test";

type SelectListWithoutSearchProps = { page: Page; path: string; optionToSelect: string };
type SelectListWithSearchProps = { searchFieldLabel: string } & SelectListWithoutSearchProps;

/**
 * A classe "SelectList" é um componente utilitário da automação para selecionar as opções dentro de uma Select List
 */
export class SelectList {
  /**
   * O método "selectListWithoutSearch" permite ao usuário selecionar apenas uma opção em uma select list sem campo de busca.
   *
   * ```TS
	 *  await new SelectList().selectListWithoutSearch({
      	page: Page, // page do playwright para obter o contexto da página atual
      	path: "path > #obtido > .com > playwright",
      	optionToSelect: "Opção da Select List que você deseja selecionar",
    	});
   * ```
   */
  async selectListWithoutSearch({ page, path, optionToSelect }: SelectListWithoutSearchProps) {
    await page.locator(path).click();
    await page.getByRole("option", { name: optionToSelect }).click();
  }

  /**
	 * TODO: Será implementado mais tarde! NÃO DEVE SER USADO POR HORA!
	 * O método "selectListWithSearch" permite ao usuário selecionar apenas uma opção em uma select list com campo de busca.
   *
   * ```TS
	 *  await new SelectList().selectListWithSearch({
      	page: Page, // page do playwright para obter o contexto da página atual
      	path: "path > #obtido > .com > playwright",
      	optionToSelect: "Opção da Select List que você deseja selecionar",
    	});
   * ```
   */
  async selectListWithSearch({ page, path, optionToSelect, searchFieldLabel }: SelectListWithSearchProps) {
    await page.locator(path).click();
    await page.getByRole("textbox", { name: searchFieldLabel }).fill(optionToSelect); // Essa linha precisará ser ajustada
    await page.getByRole("option", { name: optionToSelect }).click();
  }
}
