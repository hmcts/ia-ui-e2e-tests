import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class PrepareDecisionAndReasonsLegalRepresentativesPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    prviousButton: this.$commonElements.previousButton,
    continueButton: this.$commonElements.continueButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    appellantRepresentativeInput: this.page.locator('input[id="appellantRepresentative"]'),
    respondentRepresentativeInput: this.page.locator('input[id="respondentRepresentative"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Prepare Decision and Reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    namesOflegalRepresentativesHeading: this.page.getByRole('heading', {
      level: 3,
      name: 'Give the names of the legal representatives in this case',
      exact: true,
    }),
    appellantRepresentativeLabel: this.page.locator('label[for="appellantRepresentative"]'),
    respondentRepresentativeLabel: this.page.locator('label[for="respondentRepresentative"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/generateDecisionAndReasons/generateDecisionAndReasonslegalRepresentatives',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.namesOflegalRepresentativesHeading).toBeVisible(),
      expect(this.$static.appellantRepresentativeLabel).toBeVisible(),
      expect(this.$static.appellantRepresentativeLabel).toHaveText('Legal representative for the appellant (Optional)'),
      expect(this.$static.respondentRepresentativeLabel).toBeVisible(),
      expect(this.$static.respondentRepresentativeLabel).toHaveText('Legal representative for the respondent (Optional)'),
    ]);
  }

  public async completePageAndContinue(options?: { appellantRepresentative: string; respondentRepresentative: string }): Promise<void> {
    if (options?.appellantRepresentative) {
      await this.$inputs.appellantRepresentativeInput.fill(options.appellantRepresentative);
      await expect(this.$inputs.appellantRepresentativeInput).toHaveValue(options.appellantRepresentative);
    } else {
      await expect(this.$inputs.appellantRepresentativeInput).toBeEmpty();
    }

    if (options?.respondentRepresentative) {
      await this.$inputs.respondentRepresentativeInput.fill(options.respondentRepresentative);
      await expect(this.$inputs.respondentRepresentativeInput).toHaveValue(options.respondentRepresentative);
    } else {
      await expect(this.$inputs.respondentRepresentativeInput).toBeEmpty();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
