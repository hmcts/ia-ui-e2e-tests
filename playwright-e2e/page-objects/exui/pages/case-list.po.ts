import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../exui-base';
import { config } from '../../../utils';

export class CaseListPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Case list', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.exuiDefaultUrl);
    await this.verifyUserIsOnPage();
  }

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: '/cases',
      pageHeading: this.$static.pageHeading,
    });

    await expect(this.page.locator('div[class="spinner-inner-container"]', { hasText: 'Loading' })).toBeHidden({ timeout: 30_000 });
  }
}
