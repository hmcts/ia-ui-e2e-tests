import { ExuiBase } from '../../../../exui-base';
import { Locator, Page } from '@playwright/test';

type listThatCanNotBeChanged = 'Case name' | 'Case reference' | 'Type';
type listThatCanBeChanged =
  | 'Reasonable adjustments'
  | 'Will additional security be required?'
  | 'Select any additional facilities required'
  | 'What stage is this hearing at?'
  | 'Will this be a paper hearing?'
  | 'What will be the methods of attendance for this hearing?'
  | 'How will each participant attend the hearing?'
  | 'How many people will attend the hearing in person?'
  | 'What are the hearing venue details?'
  | 'Does this hearing need to be in Welsh?'
  | 'Do you want a specific judge?'
  | 'Do you require a panel for this hearing?'
  | 'Length of hearing'
  | 'Does the hearing need to take place on a specific date?'
  | 'What is the priority of this hearing?'
  | 'Will this hearing need to be linked to other hearings?'
  | 'Enter any additional instructions for the hearing';

export class HearingCreateEditSummaryPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: listThatCanNotBeChanged | listThatCanBeChanged): Locator => {
    return this.page.getByText(question, { exact: true });
  };

  public $questionValueLocator(question: listThatCanNotBeChanged | listThatCanBeChanged): Locator {
    return this.page
      .locator('[class*="govuk-summary-list__row"]')
      .filter({ has: this.page.getByText(question, { exact: true }) })
      .locator('[class="govuk-summary-list__value"]');
  }

  public $changeAnswerToQuestionLocator(question: listThatCanBeChanged): Locator {
    return this.page
      .locator('[class*="govuk-summary-list__row"]')
      .filter({ has: this.page.getByText(question, { exact: true }) })
      .locator('[class="govuk-summary-list__actions"]', { hasText: /^\s*Change\s*$/ });
  }

  public readonly $interactive = {
    submitRequestButton: this.page.getByRole('button', { name: 'Submit request', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Check your answers before sending your request', level: 1, exact: true }),
    hearingRequirementsHeading: this.page.getByRole('heading', { name: 'Hearing requirements', level: 2, exact: true }),
    additionalFacilitiesHeading: this.page.getByRole('heading', { name: 'Additional facilities', level: 2, exact: true }),
    stageHeading: this.page.getByRole('heading', { name: 'Stage', level: 2, exact: true }),
    participantAttendanceHeading: this.page.getByRole('heading', { name: 'Participant attendance', level: 2, exact: true }),
    hearingVenueHeading: this.page.getByRole('heading', { name: 'Hearing venue', level: 2, exact: true }),
    languageRequirementsheading: this.page.getByRole('heading', { name: 'Language requirements', level: 2, exact: true }),
    judgeDetailsHeading: this.page.getByRole('heading', { name: 'Judge details', level: 2, exact: true }),
    panelDetailsHeading: this.page.getByRole('heading', { name: 'Panel details', level: 2, exact: true }),
    lengthDateAndPriorityHeading: this.page.getByRole('heading', { name: 'Length, date and priority level of hearing', level: 2, exact: true }),
    linkedHearingsHeading: this.page.getByRole('heading', { name: 'Linked hearings', level: 2, exact: true }),
    additionalInstructionsHeading: this.page.getByRole('heading', { name: 'Additional instructions', level: 2, exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-create-edit-summary',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async submitRequest(): Promise<void> {
    await this.navigationClick(this.$interactive.submitRequestButton);
  }
}
