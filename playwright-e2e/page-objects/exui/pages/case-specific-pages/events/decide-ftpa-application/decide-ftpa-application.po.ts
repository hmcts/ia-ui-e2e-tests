import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class DecideFtpaApplicationPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('span', { hasText: 'Decide FTPA application' }),
    applicantHeading: this.page.getByRole('heading', { level: 1, name: 'Applicant', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    applicantTypeLabel: this.page.locator('label[for="ftpaApplicantType"]'),
    applicantTypeHintText: this.page.locator('label[for="ftpaApplicantType"]').locator('+ span'),
    appellantLabel: this.page.locator('label[for="ftpaApplicantType-appellant"]'),
    homeOfficeLabel: this.page.locator('label[for="ftpaApplicantType-respondent"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decideFtpaApplication/decideFtpaApplicationftpaApplicantType',
      pageHeading: this.$static.pageHeading,
    });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.applicantHeading).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.applicantTypeLabel).toBeVisible(),
      expect(this.$static.applicantTypeLabel).toHaveText('Who made the application?'),
      expect(this.$static.applicantTypeHintText).toBeVisible(),
      expect(this.$static.applicantTypeHintText).toHaveText(
        'If you are recording a decision based on two applications, select the party that has had the biggest impact on your decision.',
      ),
      expect(this.$static.appellantLabel).toBeVisible(),
      expect(this.$static.appellantLabel).toHaveText('Appellant'),
      expect(this.$static.homeOfficeLabel).toBeVisible(),
      expect(this.$static.homeOfficeLabel).toHaveText('Home Office'),
    ]);
  }

  public async completePageAndContinue(options: { applicantType: 'Appellant' | 'Home Office' }): Promise<void> {
    await this.verifyAllTextOnPage();

    const elementToSelect = this.page.getByRole('radio', { name: options.applicantType, exact: true });
    await elementToSelect.check();
    await expect(elementToSelect).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
