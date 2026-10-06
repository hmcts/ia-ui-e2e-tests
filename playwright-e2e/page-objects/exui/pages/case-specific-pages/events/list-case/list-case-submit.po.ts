import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type listOfQuestions = 'Listing reference' | 'Listing location' | 'Will the hearing be held remotely?' | 'Listing length' | 'Date and time';

export class ListCaseSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: listOfQuestions): Locator => {
    return this.page.getByText(question, { exact: true });
  };

  public $questionValueLocator(question: listOfQuestions): Locator {
    return this.page.locator('tr', { hasText: question }).locator('td[class*="case-field-content"] span').last();
  }

  public $changeAnswerToQuestionLocator(question: listOfQuestions | 'Listing length'): Locator {
    return this.page.locator('tr', { hasText: question }).locator('td[class*="change case-field"] span').last();
  }

  public readonly $interactive = {
    listCaseButton: this.page.getByRole('button', { name: 'List case', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'List the case', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
    listingLengthText: this.page.locator('th span', { hasText: 'Listing length' }),
    listingLengthTableHeading: this.page.locator('dt span', { hasText: 'Listing length' }),
    hoursLabel: this.page.getByText('Hours', { exact: true }),
    hoursValue: this.page.locator('tr', { hasText: 'Hours' }).last().locator('ccd-read-number-field span'),
    minutesLabel: this.page.getByText('Minutes', { exact: true }),
    minutesValue: this.page.locator('tr', { hasText: 'Minutes' }).last().locator('ccd-read-number-field span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/listCase/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async listCase(): Promise<void> {
    await this.navigationClick(this.$interactive.listCaseButton);
  }
}
