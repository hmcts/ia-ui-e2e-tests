import { Page, Locator, expect } from '@playwright/test';
import { CaseOverViewBase } from '../../case-overview-base';

export class HearingsPage extends CaseOverViewBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    requestHearingButton: this.page.getByText('Request a hearing', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    currentAndUpcommingHearingsTableRow: this.page.locator('exui-case-hearings-list', { hasText: 'Current and upcoming' }).locator('tbody tr'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'Hearings',
      pageHeading: this.$static.pageHeading,
    });

    await expect(this.page.getByRole('tab', { name: 'Hearings', exact: true })).toHaveAttribute('aria-selected', 'true', { timeout: 30_000 });
  }

  public async navigateToRequestHearingPage(): Promise<void> {
    const elementToClickOn = this.$interactive.requestHearingButton;

    await expect(elementToClickOn).toBeVisible();
    await expect(elementToClickOn).toBeEnabled();

    await expect(async () => {
      if ((await elementToClickOn.isVisible()) && (await elementToClickOn.isEnabled())) {
        await elementToClickOn.click();
      }

      await expect(elementToClickOn).not.toBeVisible({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 30_000 });
  }
}
