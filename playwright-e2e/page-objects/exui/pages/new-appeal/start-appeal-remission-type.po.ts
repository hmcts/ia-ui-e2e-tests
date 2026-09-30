import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { RemissionTypeOption } from '../../../../exui-event-types';

export class StartAppealRemissionTypePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Fee remission', exact: true }),
    remissionTypeQuestionLabel: this.page.locator('div[id="remissionType"] label[for="remissionType"] span'),
    noRemissionLabel: this.page.locator('label[for="remissionType-noRemission"]'),
    hoWaiverRemissionLabel: this.page.locator('label[for="remissionType-hoWaiverRemission"]'),
    helpWithFeesLabel: this.page.locator('label[for="remissionType-helpWithFees"]'),
    exceptionalCircumstancesRemissionLabel: this.page.locator('label[for="remissionType-exceptionalCircumstancesRemission"]'),
    helpWithFeesAdviceHeading: this.page.getByRole('heading', { level: 3, name: 'More about Help with Fees', exact: true }),
    helpWithFeesAdviceParagraph: this.page.locator('dl[id="helpWithFeesAdvice"] p'),
    exceptionalCircumstancesRemissionAdviceHeading: this.page.getByRole('heading', {
      level: 3,
      name: 'More about Exceptional Circumstances Remissions',
      exact: true,
    }),
    exceptionalCircumstancesRemissionAdviceParagraph: this.page.locator('dl[id="exceptionalCircumstancesRemissionAdvice"] p'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealremissionType',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.remissionTypeQuestionLabel).toBeVisible(),
      expect(this.$static.remissionTypeQuestionLabel).toHaveText('Choose one of the following statements'),
      expect(this.$static.noRemissionLabel).toBeVisible(),
      expect(this.$static.noRemissionLabel).toHaveText('The appellant is not eligible for a fee remission'),
      expect(this.$static.hoWaiverRemissionLabel).toBeVisible(),
      expect(this.$static.hoWaiverRemissionLabel).toHaveText(
        'The appellant has a remission, e.g. Asylum support, Legal Aid, Home Office waiver, Section 17/20',
      ),
      expect(this.$static.helpWithFeesLabel).toBeVisible(),
      expect(this.$static.helpWithFeesLabel).toHaveText('The appellant has applied for help with fees'),
      expect(this.$static.exceptionalCircumstancesRemissionLabel).toBeVisible(),
      expect(this.$static.exceptionalCircumstancesRemissionLabel).toHaveText(
        'The appellant wants to apply for an Exceptional Circumstances Remission',
      ),
      expect(this.$static.helpWithFeesAdviceHeading).toBeVisible(),
      expect(this.$static.helpWithFeesAdviceParagraph).toBeVisible(),
      expect(this.$static.helpWithFeesAdviceParagraph).toHaveText(
        'Your client can apply for Help with Fees (opens in new tab). They will be sent a reference number immediately after applying.',
      ),
      expect(this.$static.exceptionalCircumstancesRemissionAdviceHeading).toBeVisible(),
      expect(this.$static.exceptionalCircumstancesRemissionAdviceParagraph).toBeVisible(),
      expect(this.$static.exceptionalCircumstancesRemissionAdviceParagraph).toHaveText(
        'Read the Tribunal Fees guidance (opens in a new tab) for more information on Exceptional Circumstances Remissions.',
      ),
    ]);
  }

  public async completePageAndContinue(options: { remissionType: RemissionTypeOption }): Promise<void> {
    const remissionTypeOption = this.page.getByRole('radio', { name: options.remissionType, exact: true });
    await remissionTypeOption.check();
    await expect(remissionTypeOption).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
