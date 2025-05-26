const automationEmail = "alerta_qualidade@teddydigital.io";
const automationPassword = "Qa25@T&ddy";

/**
 * Este é um objeto com as credenciais de acesso do QA nas automações.
 *
 * @example
 * ```typescript
 * const email = setup.user.email;
 * const senha = setup.user.password;
 *
 * const urlDoBackOffice = setup.apps.backOffice.url;
 * ```
 */
const setup = {
  user: {
    email: automationEmail,
    password: automationPassword,
  },
  apps: {
    audit: {
      url: "https://audit.hml.consig360.com.br", // FIXME: O audit só possui ambiente de HML
    },
    backOffice: {
      url: "https://mfe.teddybackoffice.com.br",
    },
    consig360: {
      url: "https://teddy2.consig360.com.br",
    },
    teddy360: {
      url: "https://app.teddy360.com.br",
    },
    virtualStore: {
      url: "https://virtual-store.teddybackoffice.com.br",
      base64:
        "eyJiYXNlVXJsIjoiaHR0cHM6Ly9iYWNrZW5kLXByb2QudGVkZHkzNjAuY29tLmJyIiwiYmFua2VyVXVpZCI6IjE5NWQ2ZjlmLWExMjctNGY4NC04N2I1LWI1NzZkNGFiYmE0MiJ9",
    },
  },
};

/**
 * outlook é um objeto com as credenciais de acesso ao outlook da Microsoft.
 *
 * @example
 * ```typescript
 * const { url, email, password } = outlook;
 *
 * console.log(url, email, password);
 * ```
 */
const outlook = {
  url: "https://outlook.office.com/mail/",
  email: automationEmail,
  password: automationPassword,
};

export { setup, outlook };
