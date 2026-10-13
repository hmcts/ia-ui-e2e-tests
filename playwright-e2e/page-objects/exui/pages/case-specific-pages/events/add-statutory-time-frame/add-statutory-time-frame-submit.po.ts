import { Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type QuestionsType = 'Reason';

export class AddStatutoryTimeFrameSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: QuestionsType): Locator =>
    this.page.locator('tr [class*="case-field-label"]').getByText(question, { exact: true });

  public $questionValueLocator(question: QuestionsType): Locator {
    return this.page
      .locator('tr', { has: this.page.locator('[class*="case-field-label"]').getByText(question, { exact: true }) })
      .locator('td ccd-field-read');
  }

  public $changeAnswerToQuestionLocator(question: QuestionsType): Locator {
    return this.page
      .locator('tr', { has: this.page.locator('[class*="case-field-label"]').getByText(question, { exact: true }) })
      .locator('td[class*="change case-field"] span', { hasText: 'Change' });
  }

  public readonly $interactive = {
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Add Statutory Timeframe', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    checkYourAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/addStatutoryTimeframe24Weeks/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async submitEvent(): Promise<void> {
    await this.navigationClick(this.$interactive.submitButton);
  }
}
