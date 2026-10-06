import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type listOfQuestions = 'Case summary document' | 'Describe the document';

export class CreateCaseSummarySubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: listOfQuestions): Locator => {
    return this.page.getByText(question, { exact: true });
  };

  public $questionValueLocator(question: listOfQuestions): Locator {
    return this.page.locator('tr', { hasText: question }).locator('td ccd-field-read span, td ccd-field-read button').last();
  }

  public $changeAnswerToQuestionLocator(question: listOfQuestions): Locator {
    return this.page.locator('tr', { hasText: question }).locator('td[class*="change case-field"] span').last();
  }

  public readonly $interactive = {
    uploadButton: this.page.getByRole('button', { name: 'Upload', exact: true }),
    previousButton: this.$commonElements.previousButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Create case summary', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/createCaseSummary/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async uploadDocument(): Promise<void> {
    await this.navigationClick(this.$interactive.uploadButton);
  }
}
