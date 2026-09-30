import { expect, Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type JudgeType = 'President of Tribunal' | 'Resident Immigration Judge' | 'Tribunal Judge';

export class HearingJudgePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    excludeJudgeButton: this.page.locator('[data-module="govuk-button"]', { hasText: 'Exclude judge' }),
    continueButton: this.$commonElements.continueButton,
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    excludeJudgeInput: this.page.locator('input[id="inputSelectPersonExclude"]'),
    nameOfJudgeToIncludeInput: this.page.locator('input[id="inputSelectPerson"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Do you want a specific judge?', level: 1, exact: true }),
    specificJudgeYesLabel: this.page.locator('label[for="specificJudgeName"]'),
    specificJudgeNoLabel: this.page.locator('label[for="noSpecificJudge"]'),
    selectAllJudgesThatApplyHeading: this.page.getByRole('heading', { name: 'Select all judge types that apply', level: 1, exact: true }),
    presidentOfTribunalLabel: this.page.locator('label', { hasText: 'President of Tribunal' }),
    residentImmigrationJudgeLabel: this.page.locator('label', { hasText: 'Resident Immigration Judge' }),
    tribunalJudgeLabel: this.page.locator('label', { hasText: 'Tribunal Judge' }),
    exludeJudgeText: this.page.locator('[id="sub-title-hint"]', { hasText: 'Exclude' }),
    nameOfJudgeHeading: this.page.getByRole('heading', { name: 'Name of the judge', level: 1, exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-judge',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextForApplicant(options: { applicantName: string }): Promise<void> {
    await Promise.all([
      expect(this.page.getByText(`Request a hearing for ${options.applicantName}`, { exact: true })).toBeVisible(),
      expect(this.$static.specificJudgeYesLabel).toHaveText('Yes'),
      expect(this.$static.specificJudgeYesLabel).toBeVisible(),
      expect(this.$static.specificJudgeNoLabel).toHaveText('No'),
      expect(this.$static.specificJudgeNoLabel).toBeVisible(),
      expect(this.$static.selectAllJudgesThatApplyHeading).toBeVisible(),
      expect(this.$static.presidentOfTribunalLabel).toHaveText('President of Tribunal'),
      expect(this.$static.presidentOfTribunalLabel).toBeVisible(),
      expect(this.$static.residentImmigrationJudgeLabel).toHaveText('Resident Immigration Judge'),
      expect(this.$static.residentImmigrationJudgeLabel).toBeVisible(),
      expect(this.$static.tribunalJudgeLabel).toHaveText('Tribunal Judge'),
      expect(this.$static.tribunalJudgeLabel).toBeVisible(),
      expect(this.$static.exludeJudgeText).toHaveText('Exclude a judge (optional)'),
      expect(this.$static.exludeJudgeText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { judgeTypesToSelect?: JudgeType[] }): Promise<void> {
    if (options.judgeTypesToSelect && options.judgeTypesToSelect.length > 0) {
      for (const judgeType of options.judgeTypesToSelect) {
        const judgeTypeLocator = this.page.getByLabel(judgeType);
        await judgeTypeLocator.click();
        await expect(judgeTypeLocator).toBeChecked();
      }
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
