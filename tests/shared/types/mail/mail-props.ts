import type { Page } from "@playwright/test";
import type { ErrorContentBodyProps } from "./error-content-body-props";

export type EmailProps = {
  page: Page;
  subject: string;
  body: ErrorContentBodyProps;
  pathToAttachment?: string;
};
