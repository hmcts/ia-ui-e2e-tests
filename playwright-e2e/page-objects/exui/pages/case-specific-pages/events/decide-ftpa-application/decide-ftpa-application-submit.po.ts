import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type listOfQuestions =
  | 'Who made the application?'
  | 'The outcome of the application'
  | 'Document'
  | 'Notice of Intention to Set Aside sent?'
  | 'List any objections to the draft Notice from either party'
  | 'Notice communication'
  | 'Tick any applicable points'
  | 'Provide any information that may be helpful to the Upper Tribunal judge';

export class DecideFtpaApplicationSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: listOfQuestions): Locator => {
    return this.page.locator('[class*="case-field-label"] span').getByText(question, { exact: true });
  };

  public $questionValueLocator(question: listOfQuestions): Locator {
    return this.page
      .locator('tr')
      .filter({
        has: this.page.locator('[class*="case-field-label"] span', { hasText: question }),
      })
      .locator('td ccd-field-read');
  }

  public $changeAnswerToQuestionLocator(question: listOfQuestions): Locator {
    return this.page
      .locator('tr')
      .filter({
        has: this.page.locator('[class*="case-field-label"] span', { hasText: question }),
      })
      .locator('td[class*="change case-field"] span', { hasText: 'Change' });
  }

  public readonly $interactive = {
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Decide FTPA application', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decideFtpaApplication/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async submitDecision(): Promise<void> {
    await this.navigationClick(this.$interactive.submitButton);
  }
}
