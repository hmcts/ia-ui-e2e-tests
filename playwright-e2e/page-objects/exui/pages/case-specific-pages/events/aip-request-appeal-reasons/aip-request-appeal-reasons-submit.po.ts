import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { DataUtils } from '../../../../../../utils';

export class AipRequestAppealReasonsSubmitPage extends ExuiBase {
  private readonly dataUtils: DataUtils = new DataUtils();
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    changeByWhatDateMustTheyComplyButton: this.page.locator('span[aria-label="Change By what date must they comply?"]'),
  } as const satisfies Record<string, Locator>;

  private readonly directionYouAreIssuingTableRowLocator = this.page.locator('tr', { hasText: 'Explain the direction' });
  private readonly whoAreYouGivingDirectionToTableRowLocator = this.page.locator('tr', { hasText: 'Who are you giving' });
  private readonly byWhatDateMustTheyComplyTableRowLocator = this.page.locator('tr', { hasText: 'By what date' });

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'AiP - Request Appeal Reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
    directionYouAreIssuingQuestion: this.directionYouAreIssuingTableRowLocator.locator('th span'),
    directionYouAreIssuingValue: this.directionYouAreIssuingTableRowLocator.locator('td span').nth(0),
    whoAreYouGivingDirectionToQuestion: this.whoAreYouGivingDirectionToTableRowLocator.locator('th span'),
    whoAreYouGivingDirectionToValue: this.whoAreYouGivingDirectionToTableRowLocator.locator('td span').nth(0),
    byWhatDateMustTheyComplyQuestion: this.byWhatDateMustTheyComplyTableRowLocator.locator('th span'),
    byWhatDateMustTheyComplyValue: this.byWhatDateMustTheyComplyTableRowLocator.locator('td span').nth(0),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestReasonsForAppeal/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async sendDirection(): Promise<void> {
    await this.navigationClick(this.$interactive.submitButton);
  }
}
