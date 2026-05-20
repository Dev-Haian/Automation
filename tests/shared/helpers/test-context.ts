import { setup } from "../setup";
import type { AppKey } from "./platform";
import { getAppUrl } from "./platform";

export type BaseDados = {
  plataforma: { url: string };
  usuario: { email: string; senha: string };
};

/** Credenciais e URL base usadas na maioria dos specs. */
export function createBaseDados(app: AppKey): BaseDados {
  return {
    plataforma: { url: getAppUrl(app) },
    usuario: {
      email: setup.user.email,
      senha: setup.user.password,
    },
  };
}
