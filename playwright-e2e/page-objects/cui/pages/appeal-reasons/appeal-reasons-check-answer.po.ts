import { Page, Locator } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class AppealReasonsCheckAnswersPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private tableRowLocator = (expectedText: string): Locator => this.page.locator('div[class="govuk-summary-list__row"]', { hasText: expectedText });

  public readonly $interactive = {
    sendButton: this.page
      .getByRole('button', { name: 'Send', exact: true })
      .or(this.page.getByRole('button', { name: 'Confirm and send', exact: true })),
    changeAnswerLink: this.tableRowLocator('Answer').locator('dd[class="govuk-summary-list__actions"] a'),
    changeSupportingEvidenceLink: this.tableRowLocator('Supporting evidence').locator('dd[class="govuk-summary-list__actions"] a'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Check your answers', exact: true }),
    questionTableRowLabel: this.tableRowLocator('Question').locator('dt'),
    questionTableRowValue: this.tableRowLocator('Question').locator('dd[class="govuk-summary-list__value"]'),
    answerTableRowLabel: this.tableRowLocator('Answer').locator('dt'),
    answerTableRowValue: this.tableRowLocator('Answer').locator('dd[class="govuk-summary-list__value"]'),
    supportingEvidenceTableRowLabel: this.tableRowLocator('Supporting evidence').locator('dt'),
    supportingEvidenceTableRowValue: this.tableRowLocator('Supporting evidence').locator('dd[class="govuk-summary-list__value"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(options: { urlPath: 'check-answer' | 'check-answer-more-time' }): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: options.urlPath, pageHeading: this.$static.pageHeading });
  }

  public async submitAnswer(): Promise<void> {
    await this.navigationClick(this.$interactive.sendButton);
  }
}
