import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type listOfQuestions =
  | 'Remote hearing decision'
  | 'Remote hearing'
  | 'Vulnerabilities decision'
  | 'Adjustments to accommodate vulnerabilities'
  | 'Multimedia decision'
  | 'Multimedia equipment'
  | 'Single-sex court decision'
  | 'Single-sex court'
  | 'In camera court decision'
  | 'In camera court'
  | 'Other adjustments decision'
  | 'Other adjustments'
  | 'What type of hearing is required?'
  | 'Is the appeal suitable to float?'
  | 'Are there any additional instructions for the hearing?'
  | 'Additional Instructions';

export class ReviewHearingRequirementsSubmitPage extends ExuiBase {
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
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Review hearing requirements', exact: true }),
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
      urlPath: 'trigger/reviewHearingRequirements/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async submitEvent(): Promise<void> {
    await this.navigationClick(this.$interactive.submitButton);
  }
}
