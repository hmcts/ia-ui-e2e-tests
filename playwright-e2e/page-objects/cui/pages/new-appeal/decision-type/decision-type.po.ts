import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { decisionWithOrWithoutHearingType } from '../../../../../citizen-types';

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
    decisionHintFirstParagraph: this.page.locator('div[id="answer-hint"] p').nth(0),
    decisionHintFirstHeading: this.page.locator('div[id="answer-hint"] h2').nth(0),
    decisionHintSecondParagraph: this.page.locator('div[id="answer-hint"] p').nth(1),
    decisionHintSecondHeading: this.page.locator('div[id="answer-hint"] h2').nth(1),
    decisionHintThirdParagraph: this.page.locator('div[id="answer-hint"] p').nth(2),
    decisionHintFourthParagraph: this.page.locator('div[id="answer-hint"] p').nth(3),
    decisionWithHearingLabel: this.page.locator("//input[@value='decisionWithHearing']/following-sibling::label"),
    decisionWithoutHearingLabel: this.page.locator("//input[@value='decisionWithoutHearing']/following-sibling::label"),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'decision-type', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.decisionHintFirstParagraph).toHaveText(
        'You can choose to have a judge decide your appeal with or without a hearing. You may be able to get help to pay the fee.',
      ),
      expect(this.$static.decisionHintFirstParagraph).toBeVisible(),

      expect(this.$static.decisionHintFirstHeading).toHaveText('If you choose with a hearing'),
      expect(this.$static.decisionHintFirstHeading).toBeVisible(),

      expect(this.$static.decisionHintSecondParagraph).toHaveText(
        'A judge will decide your appeal at a hearing that you can attend. The hearing is an opportunity to tell a judge why you think the Home Office was wrong to refuse your immigration or asylum claim. If you have to pay, the fee is £144.',
      ),
      expect(this.$static.decisionHintSecondParagraph).toBeVisible(),

      expect(this.$static.decisionHintSecondHeading).toHaveText('If you choose without a hearing'),
      expect(this.$static.decisionHintSecondHeading).toBeVisible(),

      expect(this.$static.decisionHintThirdParagraph).toHaveText(
        'A judge will decide your appeal by only looking at the information and evidence you send the Tribunal. If you have to pay, the fee is £82.',
      ),
      expect(this.$static.decisionHintThirdParagraph).toBeVisible(),

      expect(this.$static.decisionHintFourthParagraph).toHaveText('Select an option'),
      expect(this.$static.decisionHintFourthParagraph).toBeVisible(),

      expect(this.$static.decisionWithHearingLabel).toHaveText('I want the appeal to be decided with a hearing'),
      expect(this.$static.decisionWithHearingLabel).toBeVisible(),

      expect(this.$static.decisionWithoutHearingLabel).toHaveText('I want the appeal to be decided without a hearing'),
      expect(this.$static.decisionWithoutHearingLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { decisionWithOrWithoutHearing: decisionWithOrWithoutHearingType }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][value="${options.decisionWithOrWithoutHearing}"]`);
    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
