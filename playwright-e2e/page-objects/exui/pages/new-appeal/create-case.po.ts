import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { ExuiCreateCaseType } from '../../../../exui-event-types';
import { config } from '../../../../utils';

export class CreateCasePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    jurisdictionDropdown: this.page.locator('select[id="cc-jurisdiction"]'),
    caseTypeDropdown: this.page.locator('select[id="cc-case-type"]'),
    eventDropdown: this.page.locator('select[id="cc-event"]'),
    startButton: this.page.getByRole('button', { name: 'Start', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Create Case', exact: true }),
    jurisdictionLabel: this.page.locator('label[for="cc-jurisdiction"]'),
    caseTypeLabel: this.page.locator('label[for="cc-case-type"]'),
    eventLabel: this.page.locator('label[for="cc-event"]'),
  } as const satisfies Record<string, Locator>;

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.exuiDefaultUrl + 'cases/case-filter');
    await this.verifyUserIsOnPage();
  }

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'cases/case-filter',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.jurisdictionLabel).toHaveText('Jurisdiction'),
      expect(this.$static.jurisdictionLabel).toBeVisible(),
      expect(this.$static.caseTypeLabel).toHaveText('Case type'),
      expect(this.$static.caseTypeLabel).toBeVisible(),
      expect(this.$static.eventLabel).toHaveText('Event'),
      expect(this.$static.eventLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: ExuiCreateCaseType): Promise<void> {
    await this.$interactive.jurisdictionDropdown.selectOption({ label: options.jurisdiction }, { timeout: 30_000 });
    await expect(this.$interactive.jurisdictionDropdown.locator('option:checked')).toHaveText(options.jurisdiction);

    await this.$interactive.caseTypeDropdown.selectOption({ label: options.caseType });
    await expect(this.$interactive.caseTypeDropdown.locator('option:checked')).toHaveText(options.caseType);

    await expect(this.$interactive.eventDropdown).toBeEnabled();
    if (options.caseType === 'Bail* master') {
      await expect(this.$interactive.eventDropdown.locator('option:checked')).toHaveText('Start the application', { timeout: 10_000 });
    } else {
      await expect(this.$interactive.eventDropdown.locator('option:checked')).toHaveText('Start the appeal', { timeout: 10_000 });
    }

    await expect(this.$interactive.startButton).toBeEnabled();
    await this.navigationClick(this.$interactive.startButton);
  }
}
