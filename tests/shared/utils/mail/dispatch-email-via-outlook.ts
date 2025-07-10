import { outlook } from "../../setup";
import { recipients } from "../../mail-recipients";
import { Screenshot } from "../screenshot";
import { formatMailBody } from "./format-mail-body";
import type { EmailProps } from "../../types/mail/email-props";
import { ONE_SECOND } from "../../test-timeout";

/**
 * Email é uma classe utilitária para trabalhar com envio de e-mail na automação via outlook
 *
 * NOTA: Essa classe deve ser chamada apenas pela classe Email, que se encontra nesse path
 * - tests/shared/utils/mail/email.ts
 */
export class DispatchEmailViaOutlook {
  /**
   * o método privado "dispatch()" é um utilitário da classe "Email" para lidar
   * com disparo de e-email via outlook.
   *
   * @example
   * ```typescript
   * await this.dispatch({
   * 	page: Page,
   * 	subject: string,
   * 	body: ErrorContentBodyProps,
   * 	pathToAttachment?: string,
   * });
   * ```
   * NOTA: este método é privado, logo, pela POO só pode ser usada dentro por métodos da própria classe "Email".
   */
  async dispatch({ page, subject, body, pathToAttachment }: EmailProps) {
    await page.goto(outlook.url, { waitUntil: "domcontentloaded", timeout: ONE_SECOND * 5 });

    await page.getByPlaceholder("Email, phone, or Skype").fill(outlook.email);
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByPlaceholder("Password").fill(outlook.password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.getByRole("button", { name: "Yes" }).click();

    await page.getByRole("button", { name: "New mail" }).nth(1).click();

    for (const recipient of recipients) {
      const aoCampo = page.getByLabel("To", { exact: true });

      await aoCampo.fill(recipient);
      await page.waitForTimeout(750);
      await aoCampo.waitFor();
      await page.keyboard.press("Enter");
    }

    await page.getByPlaceholder("Add a subject").fill(subject);

    await page.getByLabel("Message body, press Alt+F10").fill(formatMailBody(body));

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),

      await page.locator('[id="\\35 "]', { hasText: "Insert" }).click(),

      await page.getByText("Attach a file to this item.").click(),

      await page.getByText("Browse this computer").click(),
    ]);

    if (pathToAttachment !== undefined) {
      await fileChooser.setFiles(pathToAttachment);
      await page.waitForTimeout(1000 * 2.5);

      // Vai deletar o anexo após ser anexado ao e-mail
      await new Screenshot().deleteAttachmentFromPath(pathToAttachment);
    }

    await page.getByLabel("Send", { exact: true }).click();
  }
}
