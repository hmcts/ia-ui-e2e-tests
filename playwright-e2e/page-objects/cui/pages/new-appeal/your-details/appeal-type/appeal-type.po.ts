import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';
import { AppealType } from '../../../../../../citizen-types';

export class AppealTypePage extends CuiBase {
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
      hasText: 'What is your appeal type?',
    }),
    appealTypeHintParagraphs: this.page.locator('div[id="appealType-hint"] p'),
    appealTypeOptionLabels: this.page.locator('label.govuk-radios__label[for^="appealType"]'),
    appealTypeOptionHints: this.page.locator('div.govuk-radios__hint[id^="appealType"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'appeal-type', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.appealTypeHintParagraphs.nth(0)).toHaveText(
        'Select one appeal type. If you are unsure, the first page of your decision letter should include the type of decision you are appealing.',
      ),
      expect(this.$static.appealTypeHintParagraphs.nth(0)).toBeVisible(),

      expect(this.$static.appealTypeHintParagraphs.nth(1)).toHaveText(
        'If you think more than one appeal type applies to your appeal, you will have the chance to tell us about that later.',
      ),
      expect(this.$static.appealTypeHintParagraphs.nth(1)).toBeVisible(),

      expect(this.$static.appealTypeOptionLabels.nth(0)).toHaveText('Protection'),
      expect(this.$static.appealTypeOptionLabels.nth(0)).toBeVisible(),
      expect(this.$static.appealTypeOptionHints.nth(0)).toHaveText(
        'You might be afraid of the government, police or other groups in your home country because of your nationality, race, religion, political opinion or other reason.',
      ),
      expect(this.$static.appealTypeOptionHints.nth(0)).toBeVisible(),

      expect(this.$static.appealTypeOptionLabels.nth(1)).toHaveText('Human Rights'),
      expect(this.$static.appealTypeOptionLabels.nth(1)).toBeVisible(),
      expect(this.$static.appealTypeOptionHints.nth(1)).toHaveText(
        'You might have a partner or children living in the UK, have lived or worked in the UK for a long time or have serious medical needs.',
      ),
      expect(this.$static.appealTypeOptionHints.nth(1)).toBeVisible(),

      expect(this.$static.appealTypeOptionLabels.nth(2)).toHaveText('European Economic Area'),
      expect(this.$static.appealTypeOptionLabels.nth(2)).toBeVisible(),
      expect(this.$static.appealTypeOptionHints.nth(2)).toHaveText(
        'You might be, or have been, a family member or carer of an EEA/Swiss national, or have lived in another EEA country with a British family member, and want to either come to or stay in the UK.',
      ),
      expect(this.$static.appealTypeOptionHints.nth(2)).toBeVisible(),

      expect(this.$static.appealTypeOptionLabels.nth(3)).toHaveText('Revocation of Protection Status'),
      expect(this.$static.appealTypeOptionLabels.nth(3)).toBeVisible(),
      expect(this.$static.appealTypeOptionHints.nth(3)).toHaveText(
        'Your protection status might have been taken away if it is believed you no longer need it, you didn’t tell the truth in your claim or you have committed a serious crime.',
      ),
      expect(this.$static.appealTypeOptionHints.nth(3)).toBeVisible(),

      expect(this.$static.appealTypeOptionLabels.nth(4)).toHaveText('Deprivation of Citizenship'),
      expect(this.$static.appealTypeOptionLabels.nth(4)).toBeVisible(),
      expect(this.$static.appealTypeOptionHints.nth(4)).toHaveText(
        `Your British citizenship might have been taken away because it is believed you didn't tell the truth when claiming citizenship or have been involved in behaviours such as terrorism or serious organised crime.`,
      ),
      expect(this.$static.appealTypeOptionHints.nth(4)).toBeVisible(),

      expect(this.$static.appealTypeOptionLabels.nth(5)).toHaveText('EU Settlement Scheme'),
      expect(this.$static.appealTypeOptionLabels.nth(5)).toBeVisible(),
      expect(this.$static.appealTypeOptionHints.nth(5)).toHaveText(
        'You have applied for settled status, or a family or travel permit, so that you can either remain within or enter the UK, and it has been refused. A decision has been made to change or cancel your settled status, or your family or travel permit, including a deportation order that requires you to leave the UK.',
      ),
      expect(this.$static.appealTypeOptionHints.nth(5)).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { appealType: AppealType }): Promise<void> {
    const optionToSelect = options.appealType;
    const element = this.page.getByRole('radio', { name: new RegExp(`^${optionToSelect}`, 'i') });

    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
