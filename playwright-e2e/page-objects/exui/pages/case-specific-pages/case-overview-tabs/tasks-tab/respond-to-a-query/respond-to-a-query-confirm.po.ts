import { expect, type Locator, type Page } from '@playwright/test';
import { ExuiBase } from '../../../../../exui-base';

export class RespondToAQueryConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    returnToTasksLink: this.page.getByRole('link', { name: 'return to tasks', exact: true }),
    goBackToTheCaseLink: this.page.getByRole('link', { name: 'Go back to the case', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    queryResponseSubmittedHeading: this.page.getByRole('heading', { level: 1, name: 'Query response submitted', exact: true }),
    confirmationText: this.page.getByText('This query response has been added to the case', { exact: true }),
    whatHappensNextText: this.page.locator('div[class*="govuk-body"]', { hasText: 'You can return to tasks or Go back to the case' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: '/query-management/query/',
      pageHeading: this.$static.queryResponseSubmittedHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.confirmationText).toBeVisible(),
      expect(this.$static.whatHappensNextText).toBeVisible(),
      expect(this.$static.whatHappensNextText).toHaveText('You can return to tasks or Go back to the case'),
    ]);
  }

  public async returnToTasks(): Promise<void> {
    await this.navigationClick(this.$interactive.returnToTasksLink);
  }

  public async goBackToCase(): Promise<void> {
    await this.navigationClick(this.$interactive.goBackToTheCaseLink);
  }
}
