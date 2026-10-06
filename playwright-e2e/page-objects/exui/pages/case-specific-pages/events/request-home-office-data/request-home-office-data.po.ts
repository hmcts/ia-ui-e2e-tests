import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class RequestHomeOfficeDataPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    appellantDropdown: this.page.locator('select[id="homeOfficeAppellantsList"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Match appellant details', exact: true }),
    requestHomeOfficeDataSubHeading: this.page.locator('span', { hasText: 'Request Home Office data' }).last(),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    reviewTheDetailsSubmittedText: this.page.locator('[id="hoAppellantDetailsNotFoundAdvice"] p'),
    appellantDetailsHeading: this.page.getByRole('heading', { level: 2, name: 'Appellant details', exact: true }),
    appellantNameLabel: this.page.locator('[field_id="appellantFullName"] [class="case-field__label"]'),
    appellantNameValue: this.page.locator('[field_id="appellantFullName"] [class="case-field__value"]'),
    dobLabel: this.page.locator('[field_id="appellantDateOfBirth"] [class="case-field__label"]'),
    dobValue: this.page.locator('[field_id="appellantDateOfBirth"] [class="case-field__value"]'),
    makeASelectionLabel: this.page.locator('label[for="homeOfficeAppellantsList"] span'),
    makeASelectionHint: this.page.locator('label[for="homeOfficeAppellantsList"] + span[class*="form-hint"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestHomeOfficeData/requestHomeOfficeDatarequestHomeOfficeData',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAppellantDetails(options: { appellantName: string; appellantDob: string }): Promise<void> {
    await Promise.all([
      expect(this.$static.requestHomeOfficeDataSubHeading).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.reviewTheDetailsSubmittedText).toBeVisible(),
      expect(this.$static.reviewTheDetailsSubmittedText).toHaveText(
        'Review the details submitted to the Tribunal by the appellant and select the matching appellant from the list.',
      ),
      expect(this.$static.appellantDetailsHeading).toBeVisible(),
      expect(this.$static.appellantNameLabel).toBeVisible(),
      expect(this.$static.appellantNameLabel).toHaveText('Name'),
      expect(this.$static.appellantNameValue).toBeVisible(),
      expect(this.$static.appellantNameValue).toHaveText(options.appellantName),
      expect(this.$static.dobLabel).toBeVisible(),
      expect(this.$static.dobLabel).toHaveText('Date of birth'),
      expect(this.$static.dobValue).toBeVisible(),
      expect(this.$static.dobValue).toHaveText(options.appellantDob),
      expect(this.$static.makeASelectionLabel).toBeVisible(),
      expect(this.$static.makeASelectionLabel).toHaveText('Make a selection'),
      expect(this.$static.makeASelectionHint).toBeVisible(),
      expect(this.$static.makeASelectionHint).toHaveText(
        'Select the appellant that matches the details above. Select No match if the appellant does not appear on the list.',
      ),
    ]);
  }

  public async continueOnToNextPage(): Promise<void> {
    const selectedText = await this.$interactive.appellantDropdown.locator('option:checked').textContent();
    expect(selectedText?.trim()).toBe('No Match');
    await this.navigationClick(this.$interactive.continueButton);
  }
}
