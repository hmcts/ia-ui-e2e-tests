import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class StartDecisionAndReasonsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    prviousButton: this.$commonElements.previousButton,
    continueButton: this.$commonElements.continueButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    caseDescriptionTextarea: this.page.locator('textarea[id="caseIntroductionDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Start decision and reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    writeABriefIntroductionHeading: this.page.getByRole('heading', { level: 2, name: 'Write a brief introduction to the case', exact: true }),
    writeABriefIntroductionParagrapgh: this.page.locator('markdown', { hasText: 'Write a brief introduction' }).locator('p'),
    writeABriefIntroductionBulletpoint: this.page.locator('markdown', { hasText: 'Write a brief introduction' }).locator('ul li'),
    caseIntroductionLabel: this.page.locator('label[for="caseIntroductionDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decisionAndReasonsStarted/decisionAndReasonsStartedcaseIntroduction',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.writeABriefIntroductionHeading).toBeVisible(),
      expect(this.$static.writeABriefIntroductionParagrapgh).toBeVisible(),
      expect(this.$static.writeABriefIntroductionParagrapgh).toHaveText('This can cover:'),
      expect(this.$static.writeABriefIntroductionBulletpoint.nth(0)).toBeVisible(),
      expect(this.$static.writeABriefIntroductionBulletpoint.nth(0)).toHaveText("the appellant's country of origin"),
      expect(this.$static.writeABriefIntroductionBulletpoint.nth(1)).toBeVisible(),
      expect(this.$static.writeABriefIntroductionBulletpoint.nth(1)).toHaveText('their date of birth'),
      expect(this.$static.writeABriefIntroductionBulletpoint.nth(2)).toBeVisible(),
      expect(this.$static.writeABriefIntroductionBulletpoint.nth(2)).toHaveText('the decision they are appealing against'),
      expect(this.$static.caseIntroductionLabel).toBeVisible(),
      expect(this.$static.caseIntroductionLabel).toHaveText('Introduction (Optional)'),
    ]);
  }

  public async completePageAndContinue(options?: { caseIntroduction: string }): Promise<void> {
    if (options?.caseIntroduction) {
      await this.$inputs.caseDescriptionTextarea.fill(options.caseIntroduction);
      await expect(this.$inputs.caseDescriptionTextarea).toHaveValue(options.caseIntroduction);
    } else {
      await expect(this.$inputs.caseDescriptionTextarea).toBeEmpty();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
