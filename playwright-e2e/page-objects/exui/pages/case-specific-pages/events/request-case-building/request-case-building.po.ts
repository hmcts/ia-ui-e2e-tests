import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { DataUtils } from '../../../../../../utils/data.utils';

export class RequestCaseBuildingPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly dataUtils = new DataUtils();

  public readonly $inputs = {
    directionExplanationTextArea: this.page.locator('textarea[id="sendDirectionExplanation"]'),
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
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Request case building', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    introductoryParagraph: this.page.locator('[field_id="requestCaseBuildingTitle"] p'),
    directionExplanationLabel: this.page.locator('label[for="sendDirectionExplanation"]'),
    whoToSendDirectionToLabel: this.page.locator('[field_id="sendDirectionParties"] .case-field__label'),
    whoToSendDirectionToValue: this.page.locator('[field_id="sendDirectionParties"] .case-field__value'),
    byWhatDateMustTheyComplyText: this.page.locator('#sendDirectionDateDue').getByText('By what date must they comply?', { exact: true }),
    dayLabel: this.page.locator('#day-label-sendDirectionDateDue-day'),
    monthLabel: this.page.locator('#month-label-sendDirectionDateDue-month'),
    yearLabel: this.page.locator('#year-label-sendDirectionDateDue-year'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestCaseBuilding/requestCaseBuildingrequestCaseBuilding',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    const expectedDate = await this.dataUtils.getDateFromToday({ dayOffset: 42 });

    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.introductoryParagraph).toHaveText('You must now build your case by uploading your appeal argument and evidence.'),
      expect(this.$static.introductoryParagraph).toBeVisible(),
      expect(this.$static.directionExplanationLabel).toHaveText('Explain the direction you are issuing'),
      expect(this.$static.directionExplanationLabel).toBeVisible(),
      expect(this.$inputs.directionExplanationTextArea).toHaveValue(
        `You must now build your case to enable the respondent to conduct a thorough review of the appeal.

The appellant and their representative are reminded that they have an obligation under Rule 2(4) of the Procedural Rules to help the Tribunal further the overriding objective to deal with cases fairly and justly; and to cooperate with the Tribunal generally.

By the date indicated below the appellant is directed to:
- upload an Appeal Skeleton Argument (“ASA”). The form and content of this ASA must comply with the terms of Practice Direction (1.11.2024) Part 3, sections 7.1 – 7.2; 7.6 – 7.8; and 16.2. Specifically, the ASA must
   - be no more than 12 pages of numbered paragraphs.
   - be set out in three distinct parts, to include:
      - a concise summary of the appellant’s case;
      - a schedule of the disputed issues;
      - the appellant’s brief submissions on each of those issues, which explain (with reference to the decision under challenge; the evidence and appropriate legal authority) why the issues should be resolved in the appellant’s favour; and
      - the name of the author of the ASA and the date on which it was prepared.
- If the appellant’s application was made on or after 28 June 2022, the appellant’s brief submissions within the ASA must also expressly address the applicable provisions of the Nationality and Borders Act 2022 (including the different stages of the assessment set out at section 32 of NABA 2022).
- The appellant must, by the same date, upload an indexed bundle of all evidence to be relied on in the appeal including witness statements and all evidence relevant to the issues in dispute as set out within the ASA and which has not been included in the respondent’s bundle. This bundle, together with any witness statements; expert evidence or country information evidence included, must comply with Practice Direction (1.11.2024) Part 3, sections 7.1, 7.2, 7.9, 8, 9 and 10.

Parties must ensure they conduct proceedings with procedural rigour. The Tribunal will not overlook breaches of the requirements of the Procedure Rules, Practice Statement or Practice Direction, nor failures to comply with directions issued by the Tribunal. Parties are reminded of the sanctions for non-compliance set out in paragraph 5.3 of the Practice Direction of 01.11.24.
`,
      ),
      expect(this.$inputs.directionExplanationTextArea).toBeVisible(),
      expect(this.$static.whoToSendDirectionToLabel).toHaveText('Who are you giving the direction to?'),
      expect(this.$static.whoToSendDirectionToLabel).toBeVisible(),
      expect(this.$static.whoToSendDirectionToValue).toHaveText('Legal representative'),
      expect(this.$static.whoToSendDirectionToValue).toBeVisible(),
      expect(this.$static.byWhatDateMustTheyComplyText).toBeVisible(),
      expect(this.$static.dayLabel).toHaveText('Day'),
      expect(this.$static.dayLabel).toBeVisible(),
      expect(this.$static.monthLabel).toHaveText('Month'),
      expect(this.$static.monthLabel).toBeVisible(),
      expect(this.$static.yearLabel).toHaveText('Year'),
      expect(this.$static.yearLabel).toBeVisible(),
      expect(this.$inputs.dayInput).toBeVisible(),
      expect(this.$inputs.dayInput).toHaveValue(expectedDate.day.toString().padStart(2, '0')),
      expect(this.$inputs.monthInput).toBeVisible(),
      expect(this.$inputs.monthInput).toHaveValue(expectedDate.month.toString()),
      expect(this.$inputs.yearInput).toBeVisible(),
      expect(this.$inputs.yearInput).toHaveValue(expectedDate.year.toString()),
    ]);
  }

  public async completePageAndContinue(options?: {
    directionExplanation?: string;
    dueDate?: { day: string; month: string; year: string };
  }): Promise<void> {
    if (options?.directionExplanation !== undefined) {
      await this.$inputs.directionExplanationTextArea.fill(options.directionExplanation);
    }

    if (options?.dueDate !== undefined) {
      await this.$inputs.dayInput.fill(options.dueDate.day);
      await this.$inputs.monthInput.fill(options.dueDate.month);
      await this.$inputs.yearInput.fill(options.dueDate.year);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
