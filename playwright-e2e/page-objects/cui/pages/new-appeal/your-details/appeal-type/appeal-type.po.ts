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
    appealTypeHintFirstParagraph: this.page.locator('div[id="appealType-hint"] p').nth(0),
    appealTypeHintSecondParagraph: this.page.locator('div[id="appealType-hint"] p').nth(1),
    protectionAppealTypeLabel: this.page.locator('label', { hasText: /^\s*Protection/i }),
    humanRightsAppealTypeLabel: this.page.locator('label', { hasText: /^\s*Human Rights/i }),
    europeanEconomicAreaAppealTypeLabel: this.page.locator('label', { hasText: /^\s*European Economic Area/i }),
    revocationOfProtectionAppealTypeLabel: this.page.locator('label', { hasText: /^\s*Revocation of Protection/i }),
    deprivationOfCitizenshipAppealTypeLabel: this.page.locator('label', { hasText: /^\s*Deprivation of Citizenship/i }),
    eUSettlementSchemeAppealTypeLabel: this.page.locator('label', { hasText: /^\s*EU Settlement Scheme/i }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'appeal-type', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.appealTypeHintFirstParagraph).toHaveText(
        'Select one appeal type. If you are unsure, the first page of your decision letter should include the type of decision you are appealing.',
      ),
      expect(this.$static.appealTypeHintFirstParagraph).toBeVisible(),

      expect(this.$static.appealTypeHintSecondParagraph).toHaveText(
        'If you think more than one appeal type applies to your appeal, you will have the chance to tell us about that later.',
      ),
      expect(this.$static.appealTypeHintSecondParagraph).toBeVisible(),

      expect(this.$static.protectionAppealTypeLabel).toBeVisible(),
      expect(this.$static.humanRightsAppealTypeLabel).toBeVisible(),
      expect(this.$static.europeanEconomicAreaAppealTypeLabel).toBeVisible(),
      expect(this.$static.revocationOfProtectionAppealTypeLabel).toBeVisible(),
      expect(this.$static.deprivationOfCitizenshipAppealTypeLabel).toBeVisible(),
      expect(this.$static.eUSettlementSchemeAppealTypeLabel).toBeVisible(),
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
