import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

type ListOfQuestionsType =
  | 'Sponsor'
  | 'Non-legal representative'
  | "Non-legal representative's name"
  | "Non-legal representative's address"
  | "Non-legal representative's email"
  | "Non-legal representative's phone number"
  | 'Is your sponsor the same as your non-legal representative?'

export class NewAppealCheckAnswersPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    statementCheckbox: this.page.locator('input[type="checkbox"][id="statement"]'),
    submitAndContinueButton: this.page.locator('button[type="submit"]:has-text("Submit")'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Check your answers',
    }),
  } as const satisfies Record<string, Locator>;

  public $questionLocator = (questionKey: ListOfQuestionsType): Locator =>
    this.page.locator('dt.govuk-summary-list__key').getByText(questionKey, { exact: true });

  public $questionValueLocator(questionKey: ListOfQuestionsType): Locator {
    return this.page
      .locator('div.govuk-summary-list__row', { has: this.$questionLocator(questionKey) })
      .locator('dd.govuk-summary-list__value');
  }

  public $changeAnswerToQuestionLocator(questionKey: ListOfQuestionsType): Locator {
    return this.page
      .locator('div.govuk-summary-list__row', { has: this.$questionLocator(questionKey) })
      .locator('dd.govuk-summary-list__actions a', { hasText: 'Change' });
  }

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'check-answers', pageHeading: this.$static.pageHeading });
  }

  public async submitApplication(): Promise<void> {
    await this.$interactive.statementCheckbox.check();
    await expect(this.$interactive.statementCheckbox).toBeChecked();
    await this.navigationClick(this.$interactive.submitAndContinueButton);
  }
}
