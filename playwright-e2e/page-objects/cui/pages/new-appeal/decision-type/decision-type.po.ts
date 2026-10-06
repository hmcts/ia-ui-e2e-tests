import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { AppealType, decisionWithOrWithoutHearingType } from '../../../../../citizen-types';

export class DecisionTypePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'How do you want your appeal to be decided?',
    }),
    decisionHintParagraphs: this.page.locator('div[id="answer-hint"] p'),
    decisionOptionLabels: this.page.locator('label.govuk-radios__label[for^="answer"]'),
    decisionOptionHints: this.page.locator('div.govuk-radios__hint[id^="answer"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: '/decision-type', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(options: { appealType: AppealType }): Promise<void> {
    const isNonPaidAppealType = options.appealType === 'Revocation of Protection Status' || options.appealType === 'Deprivation of Citizenship';

    const withHearingHintText = isNonPaidAppealType
      ? 'A judge will decide your appeal at a hearing you can attend.'
      : 'A judge will decide your appeal at a hearing you can attend. The fee is £144.';

    const withoutHearingHintText = isNonPaidAppealType
      ? 'A judge will decide your appeal by looking at the information and evidence you send.'
      : 'A judge will decide your appeal by looking at the information and evidence you send. The fee is £82.';

    await Promise.all([
      expect(this.$static.decisionHintParagraphs.nth(0)).toHaveText(
        'You can choose to have a judge decide your appeal with or without a hearing. You may be able to get help to pay the fee.',
      ),
      expect(this.$static.decisionHintParagraphs.nth(0)).toBeVisible(),

      expect(this.$static.decisionHintParagraphs.nth(1)).toHaveText('If you choose with a hearing'),
      expect(this.$static.decisionHintParagraphs.nth(1)).toBeVisible(),

      expect(this.$static.decisionHintParagraphs.nth(2)).toHaveText(
        'A judge will decide your appeal at a hearing that you can attend. The hearing is an opportunity to tell a judge why you think the Home Office was wrong to refuse your immigration or asylum claim. If you have to pay, the fee is £144.',
      ),
      expect(this.$static.decisionHintParagraphs.nth(2)).toBeVisible(),

      expect(this.$static.decisionHintParagraphs.nth(3)).toHaveText('If you choose without a hearing'),
      expect(this.$static.decisionHintParagraphs.nth(3)).toBeVisible(),

      expect(this.$static.decisionHintParagraphs.nth(4)).toHaveText(
        'A judge will decide your appeal by only looking at the information and evidence you send the Tribunal. If you have to pay, the fee is £82.',
      ),
      expect(this.$static.decisionHintParagraphs.nth(4)).toBeVisible(),

      expect(this.$static.decisionHintParagraphs.nth(5)).toHaveText('Select an option'),
      expect(this.$static.decisionHintParagraphs.nth(5)).toBeVisible(),

      expect(this.$static.decisionOptionLabels.nth(0)).toHaveText('I want the appeal to be decided with a hearing'),
      expect(this.$static.decisionOptionLabels.nth(0)).toBeVisible(),
      expect(this.$static.decisionOptionHints.nth(0)).toHaveText(withHearingHintText),
      expect(this.$static.decisionOptionHints.nth(0)).toBeVisible(),

      expect(this.$static.decisionOptionLabels.nth(1)).toHaveText('I want the appeal to be decided without a hearing'),
      expect(this.$static.decisionOptionLabels.nth(1)).toBeVisible(),
      expect(this.$static.decisionOptionHints.nth(1)).toHaveText(withoutHearingHintText),
      expect(this.$static.decisionOptionHints.nth(1)).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { decisionWithOrWithoutHearing: decisionWithOrWithoutHearingType }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][value="${options.decisionWithOrWithoutHearing}"]`);
    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
