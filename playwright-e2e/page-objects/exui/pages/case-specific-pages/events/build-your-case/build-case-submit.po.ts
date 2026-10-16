import { Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

type BuildCaseSubmitQuestionsType = 'Appeal skeleton argument' | 'Describe the document' | 'Evidence';

export class BuildCaseSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: BuildCaseSubmitQuestionsType): Locator =>
    this.page.locator('tr [class*="case-field-label"]').getByText(question, { exact: true });

  public $questionValueLocator(question: BuildCaseSubmitQuestionsType): Locator {
    return this.page
      .locator('tr', {
        has: this.page.locator('[class*="case-field-label"]').getByText(question, { exact: true }),
      })
      .locator('td ccd-field-read');
  }

  public $changeAnswerToQuestionLocator(question: BuildCaseSubmitQuestionsType): Locator {
    return this.page
      .locator('tr', {
        has: this.page.locator('[class*="case-field-label"]').getByText(question, { exact: true }),
      })
      .locator('td[class*="change case-field"] span', { hasText: 'Change' });
  }

  public readonly $interactive = {
    submitCaseButton: this.page.getByRole('button', { name: 'Submit Case', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.page.getByRole('link', { name: 'Cancel', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Build your case', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/buildCase/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async submitCase(): Promise<void> {
    await this.navigationClick(this.$interactive.submitCaseButton);
  }
}
