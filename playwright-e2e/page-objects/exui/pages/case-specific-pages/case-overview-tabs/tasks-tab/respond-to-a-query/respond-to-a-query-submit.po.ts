import { type Locator, type Page, expect } from '@playwright/test';
import { ExuiBase } from '../../../../../exui-base';

type RespondToAQuerySubmitQuestionsType = 'Submitted query' | 'Response detail' | 'Document attached' | 'Closing the query';

export class RespondToAQuerySubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: RespondToAQuerySubmitQuestionsType): Locator =>
    this.page.locator('dt[class="govuk-summary-list__key"]').getByText(question, { exact: true });

  public $questionValueLocator(question: RespondToAQuerySubmitQuestionsType): Locator {
    return this.page
      .locator('div[class*="govuk-summary-list__row"]', {
        has: this.$questionLocator(question),
      })
      .locator('dd[class*="govuk-summary-list__value"]');
  }

  public $changeAnswerToQuestionLocator(question: RespondToAQuerySubmitQuestionsType): Locator {
    return this.page
      .locator('div[class*="govuk-summary-list__row"]', {
        has: this.$questionLocator(question),
      })
      .locator('dd[class*="govuk-summary-list__actions"] button', { hasText: 'Change' });
  }

  public readonly $interactive = {
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    previousButton: this.$commonElements.previousButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Review query response details', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: '/query-management/query/',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async submitEvent(): Promise<void> {
    await expect(async () => {
      if (await this.$static.pageHeading.isVisible()) {
        this.$interactive.submitButton.click();
      }
      await expect(this.$static.pageHeading).not.toBeVisible({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 30_000 });
  }
}
