import { expect, type Locator, type Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base.js';

export class RaiseQueryConfirmPage extends ExuiBase {
  readonly $interactive = {
    goBackToCaseLink: this.page.getByRole('link', { name: 'Go back to the case', exact: true }),
  } as const satisfies Record<string, Locator>;

  readonly $static = {
    querySubmittedHeading: this.page.getByRole('heading', { level: 1, name: 'Query submitted', exact: true }),
    confirmationText: this.page.getByText('Your query has been sent to HMCTS', { exact: true }),
    whatHappensNextSection: this.page.locator('div[class*="govuk-body"]', { hasText: 'What happens next' }),
  } as const satisfies Record<string, Locator>;

  constructor(page: Page) {
    super(page);
  }

  async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: '/raiseAQuery',
      pageHeading: this.$static.querySubmittedHeading,
    });
  }

  async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.confirmationText).toBeVisible(),
      expect(this.$static.whatHappensNextSection).toBeVisible(),
      expect(this.$static.whatHappensNextSection).toHaveText(
        `
        What happens next
        Our team will read your query and respond.
        When the response is available it will be added to the 'Queries' section.
        You can Go back to the case
        `,
        { useInnerText: true },
      ),
    ]);
  }

  public async goBackToCase(): Promise<void> {
    await this.navigationClick(this.$interactive.goBackToCaseLink);
  }
}
