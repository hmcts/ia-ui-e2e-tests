import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class GenerateUpperTribunalBundleSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    prviousButton: this.$commonElements.previousButton,
    generateButton: this.page.getByRole('button', { name: 'Generate', exact: true }),
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Generate Upper Tribunal bundle', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/generateUpperTribunalBundle/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async submitGenerateUpperTribunalEvent(): Promise<void> {
    await expect(this.$static.caseRecordHeading).toBeVisible();
    await this.navigationClick(this.$interactive.generateButton);
  }
}
