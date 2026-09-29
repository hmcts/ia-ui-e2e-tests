import { expect, type Locator, type Page } from '@playwright/test';
import { CaseOverViewBase } from '../../case-overview-base';

type QueryDetailsQuestionsType =
  | 'Sender name'
  | 'Last submitted by'
  | 'Submission date'
  | 'Query subject'
  | 'Query body'
  | 'Is the query hearing related?'
  | 'What is the date of the hearing?'
  | 'Attachments';

type QueryResponseQuestionsType = 'Last response date' | 'Response detail' | 'Attachments';

export class QueriesTabQueryDetailsPage extends CaseOverViewBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    backToQueryListButton: this.page.getByRole('button', { name: 'Back to query list', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    queryDetailsCaption: this.page.locator('table[aria-describedby="Details of the query"] caption').getByText('Query details', { exact: true }),
    responseCaption: this.page.locator('table[aria-describedby="Response of the query"] caption').getByText('Response', { exact: true }),
    theQueryHasBeenClosedText: this.page.getByText('This query has been closed by HMCTS staff.', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public $queryDetailsQuestionLocator = (question: QueryDetailsQuestionsType): Locator =>
    this.page.locator('table[aria-describedby="Details of the query"] th.govuk-table__header').getByText(question, { exact: true });

  public $queryDetailsQuestionValueLocator(question: QueryDetailsQuestionsType): Locator {
    return this.page.locator('table[aria-describedby="Details of the query"] tr', { hasText: question }).locator('td.govuk-table__cell');
  }

  public $responseQuestionLocator = (question: QueryResponseQuestionsType): Locator =>
    this.page.locator('table[aria-describedby="Response of the query"] th.govuk-table__header').getByText(question, { exact: true });

  public $responseQuestionValueLocator(question: QueryResponseQuestionsType): Locator {
    return this.page.locator('table[aria-describedby="Response of the query"] tr', { hasText: question }).locator('td.govuk-table__cell');
  }

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: '#Queries',
      pageHeading: this.$static.pageHeading,
    });

    await expect(this.page.getByRole('tab', { name: 'Queries', exact: true })).toHaveAttribute('aria-selected', 'true', { timeout: 30_000 });
  }

  public async verifyAllStaticTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$interactive.backToQueryListButton).toBeVisible(),
      expect(this.$static.queryDetailsCaption).toBeVisible(),
      expect(this.$static.responseCaption).toBeVisible(),
    ]);
  }

  public async backToQueryList(): Promise<void> {
    await expect(async () => {
      if (await this.$interactive.backToQueryListButton.isVisible()) {
        await this.$interactive.backToQueryListButton.click();
      }
      await expect(this.$interactive.backToQueryListButton).not.toBeVisible({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 30_000 });
  }
}
