import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class DecisionAndReasonsStartedAppellantSummaryPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    prviousButton: this.$commonElements.previousButton,
    continueButton: this.$commonElements.continueButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    appellantCaseDescriptionTextarea: this.page.locator('textarea[id="appellantCaseSummaryDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Start decision and reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    addAppellantCaseSummaryHeading: this.page.getByRole('heading', { level: 2, name: "Add the appellant's case summary", exact: true }),
    addAppellantCaseSummaryParagrapgh: this.page.locator('markdown', { hasText: "Add the appellant's case summary" }).locator('p'),
    appellantCaseSummaryLabel: this.page.locator('label[for="appellantCaseSummaryDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decisionAndReasonsStarted/decisionAndReasonsStartedappellantSummary',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.addAppellantCaseSummaryHeading).toBeVisible(),
      expect(this.$static.addAppellantCaseSummaryParagrapgh).toBeVisible(),
      expect(this.$static.addAppellantCaseSummaryParagrapgh).toHaveText(
        "Go to the documents tab and find the appeal skeleton argument for this case. This should contain the case summary written by the appellant's legal representative. You can copy and paste this case summary into the box below.",
      ),
      expect(this.$static.appellantCaseSummaryLabel).toBeVisible(),
      expect(this.$static.appellantCaseSummaryLabel).toHaveText("Appellant's case summary (Optional)"),
    ]);
  }

  public async completePageAndContinue(options?: { appellantCaseSummary: string }): Promise<void> {
    if (options?.appellantCaseSummary) {
      await this.$inputs.appellantCaseDescriptionTextarea.fill(options.appellantCaseSummary);
      await expect(this.$inputs.appellantCaseDescriptionTextarea).toHaveValue(options.appellantCaseSummary);
    } else {
      await expect(this.$inputs.appellantCaseDescriptionTextarea).toBeEmpty();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
