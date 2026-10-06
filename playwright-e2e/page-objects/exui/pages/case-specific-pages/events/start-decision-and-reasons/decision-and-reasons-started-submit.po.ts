import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type listOfQuestions =
  | 'Introduction'
  | "Appellant's case summary"
  | 'Do both parties agree the immigration history?'
  | 'Do both parties agree the schedule of issues?';

export class DecisionAndReasonsStartedSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: listOfQuestions): Locator => {
    return this.page.getByText(question, { exact: true });
  };

  public $questionValueLocator(question: listOfQuestions): Locator {
    return this.page.locator('tr', { hasText: question }).locator('td[class*="case-field-content"] span').last();
  }

  public $changeAnswerToQuestionLocator(question: listOfQuestions): Locator {
    return this.page.locator('tr', { hasText: question }).locator('td[class*="change case-field"] span').last();
  }

  public readonly $interactive = {
    saveButton: this.page.getByRole('button', { name: 'Save', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Start decision and reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decisionAndReasonsStarted/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async saveCase(): Promise<void> {
    await this.navigationClick(this.$interactive.saveButton);
  }
}
