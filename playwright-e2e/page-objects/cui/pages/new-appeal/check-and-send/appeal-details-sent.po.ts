import { Page, Locator } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class AppealDetailsSentPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    payForAppealButton: this.page.locator('a[class="govuk-button"]', { hasText: 'Pay for this appeal' }),
    seeYourAppealProgressButton: this.page.locator('a[class="govuk-button"]', { hasText: 'See your appeal progress' }),
    readMoreAboutAppealingAsylumDecisionLink: this.page.getByRole('link', {
      name: 'Read more about appealing an immigration or asylum decision',
      exact: true,
    }),
    findOrganisationsThatCanHelpLink: this.page.getByRole('link', {
      name: 'Find organisations that can help you with your appeal',
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page
      .locator('h1', { hasText: 'Your appeal has been submitted' })
      .or(this.page.locator('h1', { hasText: 'Your appeal details have been sent' }))
      .or(this.page.locator('h1', { hasText: 'You have sent your appeal details' }))
      .or(this.page.locator('h1', { hasText: 'Your late appeal details have been sent' })),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 2, name: 'What happens next', exact: true }),
    whatHappensNextBulletPointList: this.page.locator('ul[class="govuk-list govuk-list--bullet"]').nth(0),
    thingsYouCanDoNowHeading: this.page.getByRole('heading', { level: 2, name: 'Things you can do now', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'appeals-details-sent', pageHeading: this.$static.pageHeading });
  }

  public async clickPayForAppealButton(): Promise<void> {
    await this.navigationClick(this.$interactive.payForAppealButton);
  }
}
