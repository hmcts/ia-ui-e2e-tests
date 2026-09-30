import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class GenerateServiceRequestConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Create a service request', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    serviceRequestCreatedHeading: this.page.getByRole('heading', {
      level: 1,
      name: 'You have created a service request',
      exact: true,
    }),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 3, name: 'What happens next', exact: true }),
    whatHappensNextParagraph: this.page.getByRole('heading', { level: 3, name: 'What happens next', exact: true }).locator('+ p'),
    serviceRequestsLink: this.page.getByRole('link', { name: 'Service requests', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/generateServiceRequest/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.serviceRequestCreatedHeading).toBeVisible(),
      expect(this.$static.whatHappensNextHeading).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph).toHaveText(
        "You can now pay for this appeal in the 'Service Request' tab on the case details screen.",
      ),
      expect(this.$static.serviceRequestsLink).toBeVisible(),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
