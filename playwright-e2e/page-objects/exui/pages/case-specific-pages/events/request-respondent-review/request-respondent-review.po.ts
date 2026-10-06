import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { DataUtils } from '../../../../../../utils';

export class RequestRespondentReviewPage extends ExuiBase {
  private readonly dataUtils: DataUtils = new DataUtils();
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    directionExplinationTextArea: this.page.locator('textarea[id="sendDirectionExplanation"]'),
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
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Request respondent review', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    requestRespondentReviewParagrapgh1: this.page.locator('[id="requestRespondentReviewTitle"] p').nth(0),
    explinationOfDirectionLabel: this.page.locator('label[for="sendDirectionExplanation"]'),
    whoToSendDirectionToLabel: this.page.locator('[field_id="sendDirectionParties"] [class="case-field__label"]'),
    whoToSendDirectionToValue: this.page.locator('[field_id="sendDirectionParties"] [class="case-field__value"]'),
    byWhatDateMustTheyComplyText: this.page.locator('div[id="sendDirectionDateDue"]').getByText('By what date must they comply?'),
    dayLabel: this.page.locator('[id="day-label-sendDirectionDateDue-day"]'),
    monthLabel: this.page.locator('[id="month-label-sendDirectionDateDue-month"]'),
    yearLabel: this.page.locator('[id="year-label-sendDirectionDateDue-year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestRespondentReview/requestRespondentReviewrequestRespondentReview',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    const expectedDate = await this.dataUtils.getDateFromToday({ dayOffset: 14 });
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),

      expect(this.$static.requestRespondentReviewParagrapgh1).toHaveText(
        'You are directing the respondent to review and respond to the appeal skeleton argument.',
      ),
      expect(this.$static.requestRespondentReviewParagrapgh1).toBeVisible(),

      expect(this.$static.explinationOfDirectionLabel).toHaveText('Explain the direction you are issuing'),
      expect(this.$static.explinationOfDirectionLabel).toBeVisible(),

      expect(this.$inputs.directionExplinationTextArea).toHaveValue(`By the date below you must review the appellant’s ASA and bundle.
The review must comply with (i) Rule 24A (3) of the Tribunal Procedure Rules 2014 and (ii) Practice Direction (1.11.2024) Part 2, section 2.1 (e), Part 3, sections 7.11 – 7.12. Specifically, the review must:

- be meaningful.
- explain whether you agree that the schedule of disputed issues is correct. If not, the review must set out the correct list of disputed issues, including whether there are any further issues that the respondent wishes to raise.
- state whether you oppose or accept the appellant’s position on each issue and why.
- cross-reference your submissions to paragraphs in the decision under appeal, pages in the respondent’s bundle, any country information evidence schedule, and/or any additional evidence relied upon.
- specify which, if any, witnesses you intend to cross-examine and if you do not intend to cross-examine a witness, outline any objections to that witness’s statement being read by a judge.
- address whether the appeal should be allowed on any ground if the appellant and/or their key witnesses are found to be credible according to the applicable standard of proof.
- identify whether you are prepared to withdraw the decision (or part of it).
- state whether the appeal can be resolved without a hearing.
- not exceed 6 pages unless reasons are submitted in an accompanying application.
- not contain standard or pro-forma paragraphs.
- provide the name of the author of the review and the date.

Parties must ensure they conduct proceedings with procedural rigour. The Tribunal will not overlook breaches of the requirements of the Procedure Rules, Practice Statement or Practice Direction, nor failures to comply with directions issued by the Tribunal. Parties are reminded of the sanctions for non-compliance set out in paragraph 5.3 of the Practice Direction of 01.11.24.`),
      expect(this.$inputs.directionExplinationTextArea).toBeVisible(),

      expect(this.$static.whoToSendDirectionToLabel).toHaveText('Who are you giving the direction to?'),
      expect(this.$static.whoToSendDirectionToLabel).toBeVisible(),
      expect(this.$static.whoToSendDirectionToValue).toHaveText('Respondent'),
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
