import type { Page, Response } from "@playwright/test";
import { outlook } from "../setup";
import type { Optional } from "../types/optional";
import { recipients } from "../mail-recipients";
import { Screenshot } from "./screenshot";

type ErrorContentBody = {
  statusCode: number;
  responseURL: string;
  sut: string;
  jsonBody: any;
};

type MailProps = {
  page: Page;
  subject: string;
  body: ErrorContentBody;
  pathToAttachment?: string;
};

type AutomationContext = {
  sut: string;
  expectedStatusCode?: number;
  errorVisibleMessage?: string;
  api: Response;
} & Optional<MailProps, "body">;

export function formatMailBody(body: ErrorContentBody): string {
  return `
		Olá, prezados(as).

		Ocorreu um erro na jornada de "${body.sut}". Segue o erro:

		URL: ${JSON.stringify(body.responseURL)}
		Status: ${JSON.stringify(body.statusCode)}
		JSON: ${JSON.stringify(body.jsonBody)}

		Segue anexo(s) do erro:
	`;
}

/**
 * Email é uma classe utilitária para trabalhar com print's na automação
 */
class Email {
  /**
   * o método privado "sendMailViaOutlook()" é um utilitário da classe "Email" para lidar
   * com disparo de e-email via outlook.
   *
   * @example
   * ```typescript
   * await this.sendMailViaOutlook({
   * 	page: Page,
   * 	subject: string,
   * 	body: ErrorContentBody,
   * 	pathToAttachment?: string,
   * });
   * ```
   * NOTA: este método é privado, logo, pela POO só pode ser usada dentro por métodos da própria classe "Email".
   */
  private async sendMailViaOutlook({ body, subject, page, pathToAttachment }: MailProps) {
    await page.goto(outlook.url);

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
      // Após anexar o arquivo no e-email, deletar deste repositório
      await new Screenshot().deleteAttachmentFromPath(pathToAttachment);
    }

    await page.getByLabel("Send", { exact: true }).click();
  }

  /**
   * o método "send()" é um utilitário da classe "Email" para lidar com disparo de e-email:
   * - caso o "status code" seja diferente do esperado;
   * - caso uma mensagem de erro esteja visível em tela;
   *
   * @example
   * ```typescript
   * await new Email().send({
   * 	sut: string,
   * 	expectedStatusCode?: number,
   * 	errorVisibleMessage?: string | undefined,
   * 	api: Response,
   * });
   * ```
   * NOTA: Deve ser usada no contexto em que o QA desejar capturar o erro
   * tanto pelo status code quanto por uma mensagem de erro visível em tela.
   */
  public async send({
    page,
    expectedStatusCode,
    errorVisibleMessage,
    api,
    subject,
    sut,
    pathToAttachment,
  }: AutomationContext) {
    const statusCode = api.status() !== expectedStatusCode || !api.status();
    const errorMessage = (await page.getByText(String(errorVisibleMessage)).isVisible()) || !errorVisibleMessage;

    const data: MailProps = {
      page,
      subject,
      body: {
        sut,
        responseURL: api.url(),
        statusCode: api.status(),
        jsonBody: await api.json(),
      },
      pathToAttachment,
    };

    if (statusCode || errorMessage) {
      await this.sendMailViaOutlook(data);
    }
  }
}

export { Email };
