import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type listOfQuestions = 'Anonymity direction' | 'Legal representative for the appellant' | 'Legal representative for the respondent';

export class PrepareDecisionAndReasonsSubmitPage extends ExuiBase {
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
    generateButton: this.page.getByRole('button', { name: 'Generate', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Prepare Decision and Reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
    anonymityDirectionHeading: this.page.getByRole('heading', { level: 3, name: 'Are you giving an anonymity direction?', exact: true }),
    legalRepresentativesHeading: this.page.getByRole('heading', {
      level: 3,
      name: 'Give the names of the legal representatives in this case',
      exact: true,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/generateDecisionAndReasons/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async generateDecisionAndReasons(): Promise<void> {
    await this.navigationClick(this.$interactive.generateButton);
  }
}
