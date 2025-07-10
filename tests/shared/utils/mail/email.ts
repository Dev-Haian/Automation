import type { Optional } from "../../types/optional";
import type { HttpMethods } from "../../http-methods";
import type { EmailProps } from "../../types/mail/email-props";
import type { Response } from "@playwright/test";
import { DispatchEmailViaOutlook } from "./dispatch-email-via-outlook";

type EmailContextProps = {
  sut: string;
  mail: Optional<EmailProps, "body">;
  api: {
    response?: Response;
    httpMethod?: HttpMethods;
    expectedStatusCode?: number;
  };
  web: {
    errorVisibleMessage?: string | null;
  };
};

/**
 * Email é uma classe utilitária para trabalhar com envio de e-mail na automação
 */
class Email {
  /**
   * o método "send()" é um utilitário da classe "Email" para lidar com disparo de e-email:
   * - caso o "status code" seja diferente do esperado;
   * - caso uma mensagem de erro esteja visível em tela;
   *
   * @example
   * ```typescript
   * await new Email().send({
				sut: "nome da automação (variável sut)",
				mail: {
					page: Page, // page do Playwright,
					subject: "Assunto do e-mail",
					pathToAttachment: "Caminho do anexo (print do erro)",
				},
				api: {
					api: "rota do back-end",
					httpMethod: "POST", // Métodos Http
					expectedStatusCode: 201, // Status code
				},
				web: {
					errorVisibleMessage: "mensagem de erro vísivel no front-end",
				},
			});
   * ```
   * NOTA: Deve ser usada no contexto em que o QA desejar capturar o erro
   * tanto pelo status code quanto por uma mensagem de erro visível em tela.
   */
  public async send({ sut, mail, api, web }: EmailContextProps) {
    const { page, pathToAttachment, subject } = mail;
    const { response, expectedStatusCode } = api;
    const { errorVisibleMessage } = web;

    let emailSent = false;

    const statusCode = response?.status() !== expectedStatusCode || !response?.status();
    const errorMessage =
      (await page.getByText(String(errorVisibleMessage), { exact: true }).isVisible()) || !errorVisibleMessage;

    if (errorMessage || statusCode) {
      const data: EmailProps = {
        page,
        subject,
        body: {
          sut,
          endpoint: response?.url() ? response.url() : "Endpoint não informado/detectado",
          statusCode: response?.status() ? response.status() : 0,
          jsonBody: await response?.json(),
          httpMethod: response?.request().method() ? response?.request().method() : "Método não informado/detectado",
        },
        pathToAttachment,
      };

      await new DispatchEmailViaOutlook().dispatch(data);
      console.log(`Email disparado para a automação [${sut}].`);
      emailSent = true;

      return emailSent;
    }
    emailSent = false;
    return emailSent;
  }
}

export { Email };
