import type { Page } from "@playwright/test";
import { ONE_SECOND } from "../test-timeout";

/**
 * Esta função verifica a visibilidade da modal de notícias.
 *
 * Caso a modal esteja visível, esta função vai fechá-la, clicando nos botão:
 * - "X" para fechar a modal de notícias;
 *
 * Caso contrário, a função apenas segue o fluxo normal da automação.
 */
export async function checkExistentNewsModal(page: Page) {
  await page.waitForTimeout(ONE_SECOND * 7);

  const btnX = page.locator("lib-modal-header").getByRole("button", { name: "" });
  if (await btnX.isVisible()) {
    await btnX.click();
  }
}
