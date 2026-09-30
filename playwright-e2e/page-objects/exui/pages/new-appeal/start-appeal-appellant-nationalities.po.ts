import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { Nationality } from '../../../../citizen-types';

export type AppellantNationalityStatusType = 'Stateless' | 'Has a nationality';

export class StartAppealAppellantNationalitiesPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    addNewButton: this.page.getByRole('button', { name: 'Add new', exact: true }),
    removeButton: this.page.getByRole('button', { name: 'Remove' }),
    nationalityDropdown: this.page.locator('div[id="appellantNationalities"] select').first(),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: "What is the appellant's nationality?", exact: true }),
    nationalityLabel: this.page.locator('label[for="appellantStateless"] span'),
    statelessLabel: this.page.locator('label[for="appellantStateless-isStateless"]'),
    hasNationalityLabel: this.page.locator('label[for="appellantStateless-hasNationality"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealappellantNationalities',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.nationalityLabel).toBeVisible(),
      expect(this.$static.nationalityLabel).toHaveText('Nationality'),
      expect(this.$static.statelessLabel).toBeVisible(),
      expect(this.$static.statelessLabel).toHaveText('Stateless'),
      expect(this.$static.hasNationalityLabel).toBeVisible(),
      expect(this.$static.hasNationalityLabel).toHaveText('Has a nationality'),
    ]);
  }

  public async completePageAndContinue(options: { nationalityStatus: AppellantNationalityStatusType; nationality?: Nationality }): Promise<void> {
    await this.page.getByRole('radio', { name: options.nationalityStatus, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.nationalityStatus, exact: true })).toBeChecked();

    if (options.nationalityStatus === 'Has a nationality') {
      if (!options.nationality) {
        throw new Error('If nationalityStatus is "Has a nationality", nationality must be provided.');
      }

      await this.$interactive.addNewButton.click();

      await expect(this.$interactive.nationalityDropdown).toBeVisible();
      await this.$interactive.nationalityDropdown.selectOption({ label: options.nationality });
      await expect(this.$interactive.nationalityDropdown.locator('option:checked')).toHaveText(options.nationality);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
