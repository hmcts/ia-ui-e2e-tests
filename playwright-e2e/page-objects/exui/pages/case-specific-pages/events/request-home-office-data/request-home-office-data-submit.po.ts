import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class RequestHomeOfficeDataSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    requestHomeOfficeDataButton: this.page.getByRole('button', { name: 'Request Home Office data', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    changeAnswerToMakeASelectionButton: this.page.locator('tr', { hasText: 'Make a selection' }).locator('[class*="change case-field"] span').last(),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Request Home Office data', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    checkYourAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationText: this.page.getByText('Check the information below carefully.', { exact: true }),
    makeASelectionQuestion: this.page.getByText('Make a selection', { exact: true }),
    makeASelectionValue: this.page.locator('tr', { hasText: 'Make a selection' }).locator('ccd-field-read-label span').last(),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestHomeOfficeData/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async requestHomeOfficeData(): Promise<void> {
    await this.navigationClick(this.$interactive.requestHomeOfficeDataButton);
  }
}
