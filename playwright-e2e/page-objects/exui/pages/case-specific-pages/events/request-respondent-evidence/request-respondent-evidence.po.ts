import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { DataUtils } from '../../../../../../utils';

export class RequestRespondentEvidencePage extends ExuiBase {
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
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Request respondent evidence', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    requestRespondentEvidenceParagrapgh1: this.page.locator('[field_id="requestRespondentEvidenceTitle"] p').nth(0),
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
      urlPath: 'trigger/requestRespondentEvidence/requestRespondentEvidencerequestRespondentEvidence',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    const expectedDate = await this.dataUtils.getDateFromToday({ dayOffset: 14 });
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),

      expect(this.$static.requestRespondentEvidenceParagrapgh1).toHaveText(
        'You are directing the Home Office to supply their documents and evidence.',
      ),
      expect(this.$static.requestRespondentEvidenceParagrapgh1).toBeVisible(),

      expect(this.$static.explinationOfDirectionLabel).toHaveText('Explain the direction you are issuing'),
      expect(this.$static.explinationOfDirectionLabel).toBeVisible(),

      expect(this.$inputs.directionExplinationTextArea).toHaveValue(`A notice of appeal has been lodged against this decision.

By the date indicated below the respondent is directed to supply the documents:

The bundle must comply with (i) Rule 23 or Rule 24 of the Tribunal Procedure Rules 2014 (as applicable) and (ii) Practice Direction (1.11.2024) Part 3, sections 7.1 - 7.4. Specifically, the bundle must contain:

- the notice of decision appealed against.
- any other document provided to the appellant giving reasons for that decision.
- any evidence or material relevant to the disputed issues.
- any statements of evidence.
- the application form.
- any record of interview with the appellant in relation to the decision being appealed.
- any previous decision(s) of the Tribunal and Upper Tribunal (IAC) relating to the appellant.
- any other unpublished documents on which you rely.
- the notice of any other appealable decision made in relation to the appellant.

Where the appeal involves deportation, you must also include the following evidence:

- a copy of the Certificate of Conviction.
- a copy of any indictment/charge.
- a transcript of the Sentencing Judge's Remarks.
- a copy of any Pre-Sentence Report.
- a copy of the appellant's criminal record.
- a copy of any Parole Report or other document relating to the appellant's period in custody and/or release.
- a copy of any mental health report.

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
