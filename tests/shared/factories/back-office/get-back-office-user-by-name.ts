import { expect, type Page } from "@playwright/test";
import { ONE_SECOND } from "../../test-timeout";

type getBackOfficeUserByNameProps = { page: Page; username: string };

/**
 * Esta é uma função que pesquisa e valida a existência de um usuário no back-office
 *
 * Exemplo
 * ```TS
 * await getBackOfficeUserByName({
 * 	page: Page, // Page do Playwright
 * 	username: "Nome do usuário que você deseja buscar na automação"
 * });
 * ```
 *
 * Esta função retorna true ou false, ou seja é booleana
 */
export async function getBackOfficeUserByName({ page, username }: getBackOfficeUserByNameProps): Promise<boolean> {
  // Pesquisa pelo usuário pelo nome
  const searchForAnUser = page.getByPlaceholder("Pesquise por um usuário");
  await searchForAnUser.clear({ force: true });
  await page.waitForTimeout(ONE_SECOND * 0.8);
  await searchForAnUser.fill(username);
  // Aguarda pelo retorno do usuário
  await page.waitForTimeout(ONE_SECOND / 1.5);

  const foundUser = page.locator("div").filter({ hasText: username }).nth(2);

  return !!(await foundUser.isVisible());
}
