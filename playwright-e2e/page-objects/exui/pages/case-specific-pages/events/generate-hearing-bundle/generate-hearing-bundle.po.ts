import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class GenerateHearingBundlePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    previousButton: this.$commonElements.previousButton,
    generateButton: this.page.getByRole('button', { name: 'Generate', exact: true }),
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Generate hearing bundle', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/generateHearingBundle/generateHearingBundlegenerateHearingBundle',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async submitGenerateHearingBundleEvent(): Promise<void> {
    await expect(this.$static.caseRecordHeading).toBeVisible();
    await this.navigationClick(this.$interactive.generateButton);
  }
}
