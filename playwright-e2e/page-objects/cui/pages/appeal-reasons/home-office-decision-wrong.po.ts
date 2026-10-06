import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class HomeOfficeDecisionWrongPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    whyYouThinkHomeOfficeDecisionIsWrong: this.page.locator('textarea[name="applicationReason"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  private readonly howToAnswerQuestionHeading = this.page.getByRole('heading', { level: 2, name: 'How to answer this question', exact: true });
  private readonly needMoreTimeHeading = this.page.getByRole('heading', { level: 2, name: 'Need more time?', exact: true });
  private readonly ifYouNeedHelpHeading = this.page.getByRole('heading', { level: 2, name: 'If you need help', exact: true });

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Why do you think the Home Office decision is wrong?',
    }),
    helpfulInformationText: this.page.getByText('It may be helpful to look at'),
    reasonDecisionWrongLabel: this.page.locator('label[for="applicationReason"]'),
    howToAnswerQuestionHeading: this.howToAnswerQuestionHeading,
    howToAnswerQuestionsBulletPoint1: this.howToAnswerQuestionHeading.locator('+ ul li').nth(0),
    howToAnswerQuestionsBulletPoint2: this.howToAnswerQuestionHeading.locator('+ ul li').nth(1),
    howToAnswerQuestionsBulletPoint3: this.howToAnswerQuestionHeading.locator('+ ul li').nth(2),
    howToAnswerQuestionsBulletPoint4: this.howToAnswerQuestionHeading.locator('+ ul li').nth(3),
    howToAnswerQuestionsBulletPoint5: this.howToAnswerQuestionHeading.locator('+ ul li').nth(4),
    needMoreTimeHeading: this.needMoreTimeHeading,
    needMoreTimeFirstBulletPoint: this.needMoreTimeHeading.locator('+ ul li').nth(0),
    ifYouNeedHelpHeading: this.ifYouNeedHelpHeading,
    ifYouNeedHelpFirstBulletPoint: this.ifYouNeedHelpHeading.locator('+ ul li').nth(0),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'home-office-decision-wrong', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.helpfulInformationText).toHaveText(
        'It may be helpful to look at the Home Office documents (opens in a new tab). They include your decision letter and other information about your case.',
      ),
      expect(this.$static.helpfulInformationText).toBeVisible(),

      expect(this.$static.reasonDecisionWrongLabel).toHaveText("Tell us in your own words - you don't have to have perfect English."),
      expect(this.$static.reasonDecisionWrongLabel).toBeVisible(),

      expect(this.$static.howToAnswerQuestionHeading).toBeVisible(),

      expect(this.$static.howToAnswerQuestionsBulletPoint1).toHaveText('Carefully read your Home Office decision letter'),
      expect(this.$static.howToAnswerQuestionsBulletPoint1).toBeVisible(),

      expect(this.$static.howToAnswerQuestionsBulletPoint2).toHaveText('Try to understand the parts of your claim the Home Office disagrees with'),
      expect(this.$static.howToAnswerQuestionsBulletPoint2).toBeVisible(),

      expect(this.$static.howToAnswerQuestionsBulletPoint3).toHaveText('Respond to some or all the things the Home Office disagrees with'),
      expect(this.$static.howToAnswerQuestionsBulletPoint3).toBeVisible(),

      expect(this.$static.howToAnswerQuestionsBulletPoint4).toHaveText(
        'Tell us about anything new that will affect your case since you made your claim',
      ),
      expect(this.$static.howToAnswerQuestionsBulletPoint4).toBeVisible(),

      expect(this.$static.howToAnswerQuestionsBulletPoint5).toHaveText('Include supporting evidence where you can. You can do this on the next page'),
      expect(this.$static.howToAnswerQuestionsBulletPoint5).toBeVisible(),

      expect(this.$static.needMoreTimeHeading).toBeVisible(),

      expect(this.$static.needMoreTimeFirstBulletPoint).toHaveText('Save your answer and ask for more time'),
      expect(this.$static.needMoreTimeFirstBulletPoint).toBeVisible(),

      expect(this.$static.ifYouNeedHelpHeading).toBeVisible(),

      expect(this.$static.ifYouNeedHelpFirstBulletPoint).toHaveText('Find organisations that can help you with your appeal'),
      expect(this.$static.ifYouNeedHelpFirstBulletPoint).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { reasonWhyHomeOfficeDecisionIsWrong: string }): Promise<void> {
    await this.$inputs.whyYouThinkHomeOfficeDecisionIsWrong.fill(options.reasonWhyHomeOfficeDecisionIsWrong);
    await expect(this.$inputs.whyYouThinkHomeOfficeDecisionIsWrong).toHaveValue(options.reasonWhyHomeOfficeDecisionIsWrong);
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
