import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { DataUtils } from '../../../../../../utils';

export class AipRequestAppealReasonsPage extends ExuiBase {
  private readonly dataUtils: DataUtils = new DataUtils();
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    dayInput: this.page.locator('input[name="sendDirectionDateDue-day"]'),
    monthInput: this.page.locator('input[name="sendDirectionDateDue-month"]'),
    yearInput: this.page.locator('input[name="sendDirectionDateDue-year"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'AiP - Request Appeal Reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    explinationOfDirectionLabel: this.page.locator('[field_id="sendDirectionExplanation"] [class="case-field__label"]'),
    explinationOfDirectionValue: this.page.locator('[field_id="sendDirectionExplanation"] [class="case-field__value"]'),
    whoToSendDirectionToLabel: this.page.locator('[field_id="sendDirectionParties"] [class="case-field__label"]'),
    whoToSendDirectionToValue: this.page.locator('[field_id="sendDirectionParties"] [class="case-field__value"]'),
    byWhatDateMustTheyComplyText: this.page.locator('div[id="sendDirectionDateDue"]').getByText('By what date must they comply?'),
    dayLabel: this.page.locator('[id="day-label-sendDirectionDateDue-day"]'),
    monthLabel: this.page.locator('[id="month-label-sendDirectionDateDue-month"]'),
    yearLabel: this.page.locator('[id="year-label-sendDirectionDateDue-year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestReasonsForAppeal/requestReasonsForAppealrequestReasonsForAppeal',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    const expectedDate = await this.dataUtils.getDateFromToday({ dayOffset: 28 });
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),

      expect(this.$static.explinationOfDirectionLabel).toHaveText('Explain the direction you are issuing'),
      expect(this.$static.explinationOfDirectionLabel).toBeVisible(),

      expect(this.$static.explinationOfDirectionValue).toHaveText(
        'You must now tell us why you think the Home Office decision to refuse your claim is wrong.',
      ),
      expect(this.$static.explinationOfDirectionValue).toBeVisible(),

      expect(this.$static.whoToSendDirectionToLabel).toHaveText('Who are you giving the direction to?'),
      expect(this.$static.whoToSendDirectionToLabel).toBeVisible(),
      expect(this.$static.whoToSendDirectionToValue).toHaveText('Appellant'),
      expect(this.$static.whoToSendDirectionToValue).toBeVisible(),

      expect(this.$static.byWhatDateMustTheyComplyText).toBeVisible(),

      expect(this.$static.dayLabel).toHaveText('Day'),
      expect(this.$static.dayLabel).toBeVisible(),
      expect(this.$static.monthLabel).toHaveText('Month'),
      expect(this.$static.monthLabel).toBeVisible(),
      expect(this.$static.yearLabel).toHaveText('Year'),
      expect(this.$static.yearLabel).toBeVisible(),

      expect(this.$inputs.dayInput).toHaveValue(expectedDate.day.toString().padStart(2, '0')),
      expect(this.$inputs.dayInput).toBeVisible(),
      expect(this.$inputs.monthInput).toHaveValue(expectedDate.month.toString().padStart(2, '0')),
      expect(this.$inputs.monthInput).toBeVisible(),
      expect(this.$inputs.yearInput).toHaveValue(expectedDate.year.toString()),
      expect(this.$inputs.yearInput).toBeVisible(),
    ]);
  }

  public async continueOnToNextPage(): Promise<void> {
    await this.navigationClick(this.$interactive.continueButton);
  }
}
