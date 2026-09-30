import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

type StartAppealSubmitQuestionsType =
  | 'Is the appellant currently living in the United Kingdom?'
  | 'Is the appellant currently in detention?'
  | 'Detention facility'
  | 'Immigration removal centre name'
  | 'Does the appellant have a pending bail application?'
  | "What is the appellant's bail application number?"
  | 'Home Office UAN or GWF reference'
  | 'Title'
  | 'Given names'
  | 'Family name'
  | 'Date of birth'
  | 'Type of appeal'
  | 'Home Office decision date'
  | 'Does the appellant have a sponsor?'
  | 'Contact details'
  | 'Mobile phone number'
  | 'Does the appellant give authorisation for the sponsor to access information relating to the appeal?'
  | 'Has a deportation order been made against the appellant?'
  | 'Are removal directions currently set for the appellant?'
  | 'Are there any reasons the appellant wishes to remain in the UK or any new grounds on which they should be permitted to stay?'
  | 'Explain these new matters and their relevance to the appeal'
  | 'Has the appellant appealed against any other UK immigration decision?'
  | 'Company'
  | 'Contact number'
  | 'Own reference'
  | 'How do you want the appeal to be decided?'
  | 'Choose one of the following statements'
  | 'Nationality'
  | 'The grounds of your appeal'
  | 'Notice of Decision'
  | 'Address'
  | 'What type of decision are you appealing?'
  | 'Does your client have a correspondence address outside the UK?'
  | 'Enter the address'
  | 'Communication Preference'
  | "Appellant's email address"
  | 'Select at least one of the options below'
  | 'Check the box if this statement also applies'
  | 'Date of entry clearance decision'
  | 'Select a payment method'
  | 'What date and time is set for the removal?'
  | 'How does the appellant want the appeal to be decided?'
  | 'Does the appellant have a postal address?'
  | "Appellant's mobile phone number"
  | 'Asylum Support reference number'
  | 'Asylum Support confirmation letter';

export class StartAppealSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: StartAppealSubmitQuestionsType): Locator =>
    this.page.locator('tr [class*="case-field-label"]').getByText(question, { exact: true });

  public $questionValueLocator(question: StartAppealSubmitQuestionsType): Locator {
    return this.page
      .locator('tr', { has: this.page.locator('[class*="case-field-label"]').getByText(question, { exact: true }) })
      .locator('td ccd-field-read');
  }

  public $changeAnswerToQuestionLocator(question: StartAppealSubmitQuestionsType): Locator {
    return this.page
      .locator('tr', { has: this.page.locator('[class*="case-field-label"]').getByText(question, { exact: true }) })
      .locator('td[class*="change case-field"] span', { hasText: 'Change' });
  }

  public readonly $interactive = {
    saveAndContinueButton: this.page.getByRole('button', { name: 'Save and continue', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Start the appeal', exact: true }),
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async saveAndContinue(): Promise<void> {
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
