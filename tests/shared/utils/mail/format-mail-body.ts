import type { ErrorContentBodyProps } from "../../types/mail/error-content-body-props";

export function formatMailBody(body: ErrorContentBodyProps): string {
  return `
		Olá, prezados(as).

		Ocorreu um erro na jornada de [${body.sut}]. Segue o erro:

		Endpoint: ${JSON.stringify(body.responseURL)}
		Método Http: ${body.httpMethod}
		Status: ${JSON.stringify(body.statusCode)}
		JSON: ${JSON.stringify(body.jsonBody)}

		Segue anexo(s) do erro:
	`;
}
