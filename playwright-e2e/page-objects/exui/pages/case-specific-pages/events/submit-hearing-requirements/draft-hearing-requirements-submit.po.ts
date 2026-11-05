import { Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type DraftHearingRequirementsSubmitType =
  | 'Will the appellant attend the hearing?'
  | 'Will the appellant give oral evidence at the hearing?'
  | 'Will any witnesses attend the hearing?'
  | 'Witness details'
  | 'Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?'
  | 'Will the appellant need a spoken or sign language interpreter at the hearing?'
  | 'What kind of interpreter will the appellant need?'
  | 'Tell us which spoken language is needed for the appellant'
  | 'Tell us which sign language is needed for the appellant'
  | 'Will any of the witnesses require a spoken or sign language interpreter at the hearing?'
  | 'Do you need a hearing room with step-free access?'
  | 'Do you need a hearing loop?'
  | "Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?"
  | 'Does the appellant have any physical or mental health issues that may impact them on the day?'
  | 'Explain in detail how any physical or mental health issues may affect them on the day.'
  | 'Has the appellant had any past experiences that may impact them on the day?'
  | 'Explain in detail how any past experiences may affect them on the day?'
  | 'Do you have multimedia evidence?'
  | "You should provide the equipment to play this evidence. If this is not possible, explain why and what equipment you'll need to play it."
  | 'Does the appellant need a single-sex court?'
  | 'What type of court do they need?'
  | 'Explain in detail why the appellant needs a single-sex court.'
  | 'Does the appellant need an in camera court?'
  | 'Explain in detail why the appellant needs an in camera court.'
  | 'Is there anything else you would like to request?'
  | 'Provide details of any additional requests and why they are necessary.'
  | 'Are there any dates that the appellant or their on-day representation cannot attend?'
  | 'Dates to avoid'
  | 'Explain in detail anything you would like the Tribunal to consider'
  | `What kind of interpreter does ${string} need?`
  | `Which spoken language interpreter is needed for ${string}?`
  | `Which sign language is needed for ${string}?`;

export class DraftHearingRequirementsSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: DraftHearingRequirementsSubmitType): Locator =>
    this.page.locator('tr [class*="case-field-label"]').getByText(question, { exact: true });

  public $questionValueLocator(question: DraftHearingRequirementsSubmitType): Locator {
    return this.page
      .locator('tr', { has: this.page.locator('[class*="case-field-label"]').getByText(question, { exact: true }) })
      .locator('td[class*="case-field-content"]');
  }

  public $changeAnswerToQuestionLocator(question: DraftHearingRequirementsSubmitType): Locator {
    return this.page
      .locator('tr', { has: this.page.locator('[class*="case-field-label"]').getByText(question, { exact: true }) })
      .locator('td[class*="case-field-change"] span', { hasText: 'Change' });
  }

  public readonly $interactive = {
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Submit hearing requirements', exact: true }),
    checkYourAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
    checkYourAnswersTable: this.page.getByRole('table', { name: 'check your answers table', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async submit(): Promise<void> {
    await this.navigationClick(this.$interactive.submitButton);
  }
}
