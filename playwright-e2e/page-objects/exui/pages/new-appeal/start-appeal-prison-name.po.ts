import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { PrisonNameType } from '../../../../exui-event-types';

export class StartAppealPrisonNamePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    prisonNameDropdown: this.page.locator('select[id="prisonName"]'),
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'In which prison is the appellant detained?', exact: true }),
    prisonNameLabel: this.page.locator('label[for="prisonName"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealprisonName',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.prisonNameLabel).toBeVisible(),
      expect(this.$static.prisonNameLabel).toHaveText('Prison name'),
    ]);
  }

  public async completePageAndContinue(options: { prisonName: PrisonNameType }): Promise<void> {
    await this.$interactive.prisonNameDropdown.selectOption({ label: options.prisonName });
    expect(await this.$interactive.prisonNameDropdown.locator('option:checked').textContent()).toBe(options.prisonName);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
