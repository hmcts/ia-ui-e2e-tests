import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type RequestCaseBuildingQuestionsType =
  | 'Explain the direction you are issuing'
  | 'Who are you giving the direction to?'
  | 'By what date must they comply?';

export class RequestCaseBuildingSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: RequestCaseBuildingQuestionsType): Locator =>
    this.page.locator('tr [class*="case-field-label"]').getByText(question, { exact: true });

  public $questionValueLocator(question: RequestCaseBuildingQuestionsType): Locator {
    return this.page
      .locator('tr', {
        has: this.page.locator('[class*="case-field-label"]').getByText(question, { exact: true }),
      })
      .locator('td ccd-field-read');
  }

  public $changeAnswerToQuestionLocator(question: RequestCaseBuildingQuestionsType): Locator {
    return this.page
      .locator('tr', {
        has: this.page.locator('[class*="case-field-label"]').getByText(question, { exact: true }),
      })
      .locator('td[class*="change case-field"] span', { hasText: 'Change' });
  }

  public readonly $interactive = {
    sendDirectionButton: this.page.getByRole('button', { name: 'Send direction', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.page.getByRole('link', { name: 'Cancel', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Request case building', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestCaseBuilding/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async sendDirection(): Promise<void> {
    await this.navigationClick(this.$interactive.sendDirectionButton);
  }
}
