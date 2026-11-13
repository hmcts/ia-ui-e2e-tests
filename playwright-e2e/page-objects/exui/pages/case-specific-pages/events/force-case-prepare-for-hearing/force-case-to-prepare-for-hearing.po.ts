import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class ForceCaseToPrepareForHearingPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Force case - prepare hearing', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    appealReferenceLabel: this.page.locator('dt.case-field__label').getByText('Appeal reference', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/forceCaseToPrepareForHearing/forceCaseToPrepareForHearingforceCaseToPrepareForHearing',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([expect(this.$static.caseRecordHeading).toBeVisible(), expect(this.$static.appealReferenceLabel).toBeVisible()]);
  }

  public async submitEvent(): Promise<void> {
    await this.navigationClick(this.$interactive.submitButton);
  }
}
