import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { ImmigrationRemovalCentreNameType } from '../../../../exui-event-types';

export class StartAppealIrcNamePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    ircNameDropdown: this.page.locator('select[id="ircName"]'),
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'In which immigration removal centre is the appellant detained?', exact: true }),
    ircNameLabel: this.page.locator('label[for="ircName"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealircName',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.ircNameLabel).toBeVisible(),
      expect(this.$static.ircNameLabel).toHaveText('Immigration removal centre name'),
    ]);
  }

  public async completePageAndContinue(options: { ircName: ImmigrationRemovalCentreNameType }): Promise<void> {
    await this.$interactive.ircNameDropdown.selectOption({ label: options.ircName });
    expect(await this.$interactive.ircNameDropdown.locator('option:checked').textContent()).toBe(options.ircName);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
