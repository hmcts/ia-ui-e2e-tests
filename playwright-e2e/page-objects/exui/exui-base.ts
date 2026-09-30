import { Base } from '../base';
import { Locator } from '@playwright/test';

// A base page inherited by pages & components
// can contain any additional config needed + reusable methods accross CUI pages
export abstract class ExuiBase extends Base {
  protected readonly $commonElements = {
    continueButton: this.page.getByRole('button', { name: 'Continue', exact: true }),
    previousButton: this.page.getByRole('button', { name: 'Previous', exact: true }),
    cancelButton: this.page.getByRole('button', { name: 'Cancel', exact: true }),
    closeAndReturnToCaseDetailsButton: this.page.getByRole('button', { name: 'Close and Return to case details', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $headerComponent = {
    caseListLink: this.page.getByRole('link', { name: 'Case list', exact: true }),
    createCaseLink: this.page.getByRole('link', { name: 'Create case', exact: true }),
  } as const satisfies Record<string, Locator>;
}
