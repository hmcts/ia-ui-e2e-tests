import { Page, Locator } from '@playwright/test';
import { CuiBase } from '../cui-base';

export class AppealOverviewPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.page.locator('a[role="button"]', {
      hasText: 'Continue',
    }),
    payForAppealLink: this.page.getByRole('link', { name: 'Pay for this appeal' }),
    applyForPermissionToAppealUpperTribunalLink: this.page.getByRole('link', { name: 'Apply for permission to appeal to the Upper Tribunal' }),
    askForMoreTimeLink: this.page.getByRole('link', { name: 'Ask for more time' }),
    backToYourAppealsButton: this.page.getByRole('link', { name: 'Back to view appeals', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    userNameHeading: this.page.locator('h1[class*="govuk-heading"]'),
    nothingToDoNextHeading: this.page.getByRole('heading', { name: 'Nothing to do next', level: 2, exact: true }),
    doThisNextHeading: this.page.getByRole('heading', { name: 'Do this next', level: 2, exact: true }),
    completedHeading: this.page.getByRole('heading', { name: 'Completed', level: 2, exact: true }),
    applicantInstructionsWindow: this.page.locator('div[class*="overview-banner"]'),
    yourAppealDetailsHeading: this.page.getByRole('heading', { name: 'Your appeal details', level: 3, exact: true }),
    yourAppealDetailsTimeLine: this.page
      .getByRole('heading', { name: 'Your appeal details', level: 3, exact: true })
      .locator('~ [class="timeline-section"]'),
    yourAppealArgumentHeading: this.page.getByRole('heading', { name: 'Your appeal argument', level: 3, exact: true }),
    yourAppealArgumentTimeLine: this.page
      .getByRole('heading', { name: 'Your appeal argument', level: 3, exact: true })
      .locator('~ [class="timeline-section"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'appeal-overview', pageHeading: this.$static.userNameHeading });
  }
}
