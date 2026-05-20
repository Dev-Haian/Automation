import { setup } from "../setup";

export type AppKey = "teddy360" | "conkey";

export function getAppUrl(app: AppKey): string {
  return setup.apps[app].url;
}
