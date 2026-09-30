import { Page, Locator, expect } from '@playwright/test';
import { CaseOverViewBase } from './case-overview-base';
import { config } from '../../../../utils';

export class CaseOverviewPage extends CaseOverViewBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    nextStepsDropdown: this.$commonCaseOverviewElements.nextStepsDropdown,
    goButton: this.$commonCaseOverviewElements.goButton,
  } as const satisfies Record<string, Locator>;

  private readonly doThisNextHeadingLocator = this.page
    .getByRole('heading', { level: 2, name: 'Do this next', exact: true })
    .filter({ visible: true });
  private readonly whatHappensNextHeadingLocator = this.page
    .getByRole('heading', { level: 2, name: 'What happens next', exact: true })
    .filter({ visible: true });
  private readonly whatToDoNextHeadingLocator = this.page
    .getByRole('heading', { level: 2, name: 'What to do next', exact: true })
    .filter({ visible: true });

  public readonly $static = {
    pageHeading: this.page
      .getByRole('heading', { level: 2, name: 'Current progress of the case', exact: true })
      .first()
      .filter({ hasNot: this.page.locator('xpath=ancestor::div[@hidden]') }),
    doThisNextHeading: this.doThisNextHeadingLocator,
    doThisNextParagraph: this.doThisNextHeadingLocator.locator('~ p'),
    doThisNextHeadingsLevel2: this.doThisNextHeadingLocator.locator('~ h2'),
    doThisNextBulletPoint: this.page.locator('markdown', { hasText: 'Do this next' }).filter({ visible: true }).locator('li'),
    whatHappensNextHeading: this.whatHappensNextHeadingLocator,
    whatHappensNextParagraph: this.whatHappensNextHeadingLocator.locator('~ p'),
    whatToDoNextHeading: this.whatToDoNextHeadingLocator,
    whatToDoNextParagraph: this.whatToDoNextHeadingLocator.locator('~ p'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(options: { timeoutMs?: number }): Promise<void> {
    options.timeoutMs = options.timeoutMs ?? 30_000;
    await this.verifyUserIsOnExpectedPage({ urlPath: '#Overview', pageHeading: this.$static.pageHeading, timeout: options.timeoutMs });

    await expect(this.page.getByRole('tab', { name: /^Overview/ })).toHaveAttribute('aria-selected', 'true', {
      timeout: options.timeoutMs,
    });
  }

  public async goTo(options: { caseId: string; timeoutInMs?: number }): Promise<void> {
    const timeout = options.timeoutInMs ? options.timeoutInMs : 30_000;
    await this.page.goto(`${config.urls.exuiDefaultUrl}cases/case-details/IA/Asylum/${options.caseId}#Overview`);
    await this.verifyUserIsOnPage({ timeoutMs: timeout });
  }

  public async refreshPageUntilExpectedTextIsVisible(options: { expectedText: string; timeoutInSeconds?: number }): Promise<void> {
    const timeout = options.timeoutInSeconds ? options.timeoutInSeconds * 1000 : 45_000;
    const pageUrl = this.page.url();
    expect(pageUrl).toContain('#Overview');

    await expect(async () => {
      if (!this.page.url().includes('#Overview')) {
        await this.page.goto(pageUrl);
        await this.verifyUserIsOnPage({ timeoutMs: 15_000 });
      } else {
        await this.page.reload();
        await this.verifyUserIsOnPage({ timeoutMs: 15_000 });
      }

      const locator = this.page.getByText(options.expectedText);
      const count = await locator.count();

      let isAnyVisible = false;

      for (let i = 0; i < count; i++) {
        if (await locator.nth(i).isVisible()) {
          isAnyVisible = true;
          break;
        }
      }

      expect(isAnyVisible).toBeTruthy();
    }).toPass({
      timeout,
      intervals: [1_000],
    });
  }
}
