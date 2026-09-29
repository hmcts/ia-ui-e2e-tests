import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type listOfQuestions =
  | 'Query subject'
  | 'Query detail'
  | 'Is the query hearing related?'
  | 'What is the date of the hearing?'
  | 'Upload a file to the query';

export class RaiseQuerySubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: listOfQuestions): Locator =>
    this.page.locator('dt[class="govuk-summary-list__key"]').getByText(question, { exact: true });

  public $questionValueLocator(question: listOfQuestions): Locator {
    return this.page
      .locator('div[class*="govuk-summary-list__row"]', {
        has: this.$questionLocator(question),
      })
      .locator('dd[class*="govuk-summary-list__value"]');
  }

  public $changeAnswerToQuestionLocator(question: listOfQuestions): Locator {
    return this.page
      .locator('div[class*="govuk-summary-list__row"]', {
        has: this.$questionLocator(question),
      })
      .locator('dd[class="govuk-summary-list__actions"]', { hasText: 'Change' });
  }

  public readonly $interactive = {
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelAndReturnToCaseLink: this.page.getByRole('link', { name: 'Cancel and return to case', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    caption: this.page.getByText('Raise a query', { exact: true }),
    reviewQueryDetailsHeading: this.page.getByRole('heading', { level: 1, name: 'Review query details', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: '/raiseAQuery',
      pageHeading: this.$static.caption,
    });
  }

  public async submitEvent(): Promise<void> {
    await expect(async () => {
      if (await this.$static.reviewQueryDetailsHeading.isVisible()) {
        this.$interactive.submitButton.click();
      }
      await expect(this.$static.reviewQueryDetailsHeading).not.toBeVisible({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 30_000 });
  }
}
