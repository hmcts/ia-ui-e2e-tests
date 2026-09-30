import { expect, Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

const hearingStages = ['Bail', 'Case Management Review', 'Costs', 'Substantive'] as const;
type HearingStageType = (typeof hearingStages)[number];

export class HearingStagePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'What stage is this hearing at?', level: 1, exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-stage',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextForApplicant(options: { applicantName: string }): Promise<void> {
    await Promise.all([
      expect(this.page.getByText(`Request a hearing for ${options.applicantName}`, { exact: true })).toBeVisible(),
      ...hearingStages.map((stage) => expect(this.page.getByRole('radio', { name: stage, exact: true })).toBeVisible()),
    ]);
  }

  public async completePageAndContinue(options: { hearingStage: HearingStageType }): Promise<void> {
    const locatorToSelect = this.page.getByRole('radio', { name: options.hearingStage, exact: true });
    await locatorToSelect.click();
    await expect(locatorToSelect).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
