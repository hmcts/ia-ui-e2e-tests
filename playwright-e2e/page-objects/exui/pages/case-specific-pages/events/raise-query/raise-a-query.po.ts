import { expect, type Locator, type Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base.js';
import { YesOrNoType } from '../../../../../../citizen-types.js';
import { UiDocumentUploadHelper } from '../../../../../../utils/ui-document-upload-helper.js';

type RaiseAQueryPageOptions = {
  querySubject: string;
  queryDetail: string;
  isHearingRelated: YesOrNoType;
  dateOfHearing?: {
    day: number;
    month: number;
    year: number;
  };
  optionallyAttachDocument?: YesOrNoType;
  nameOfDocument?: string;
};

export class RaiseAQueryPage extends ExuiBase {
  private readonly uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  readonly $inputs = {
    querySubject: this.page.getByLabel('Query subject', { exact: true }),
    queryDetail: this.page.getByLabel('Query detail', { exact: true }),
    hearingDay: this.page.getByRole('textbox', { name: 'Day', exact: true }),
    hearingMonth: this.page.getByRole('textbox', { name: 'Month', exact: true }),
    hearingYear: this.page.getByRole('textbox', { name: 'Year', exact: true }),
    chooseFileToUpload: this.page.locator('input[id="documentCollection_value"]'),
  } as const satisfies Record<string, Locator>;

  readonly $interactive = {
    continueButton: this.page.getByRole('button', { name: 'Continue', exact: true }),
    previousButton: this.page.getByRole('button', { name: 'Previous', exact: true }),
    addNewDocumentButton: this.page.getByRole('button', { name: 'Add new', exact: true }),
    cancelAndReturnToCaseLink: this.page.getByRole('link', { name: 'Cancel and return to case', exact: true }),
  } as const satisfies Record<string, Locator>;

  readonly $static = {
    caption: this.page.getByText('Raise a query', { exact: true }),
    enterQueryDetailsHeading: this.page.getByRole('heading', { level: 1, name: 'Enter query details', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    subjectHint: this.page.locator('div[id="subject-hint"]'),
    detailHint: this.page.getByText('Include as many details'),
    hearingRelatedLabel: this.page.getByText('Is the query hearing related?', { exact: true }),
    hearingRelatedYesLabel: this.page.locator('label[for="isHearingRelated-yes"]'),
    hearingRelatedNoLabel: this.page.locator('label[for="isHearingRelated-no"]'),
    dateOfHearingLabel: this.page.getByText('What is the date of the hearing?', { exact: true }),
    addDocumentHeading: this.page.getByRole('heading', { level: 2, name: 'Attach a document to this query (Optional)', exact: true }),
    documentHint: this.page.locator('span[class="form-hint"]'),
    attachADocumentHeading: this.page.getByRole('heading', { level: 3, name: 'Attach a document to this query', exact: true }),
  } as const satisfies Record<string, Locator>;

  constructor(page: Page) {
    super(page);
  }

  async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: '/raiseAQuery',
      pageHeading: this.$inputs.querySubject,
    });
  }

  async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caption).toBeVisible(),
      expect(this.$static.enterQueryDetailsHeading).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.subjectHint).toBeVisible(),
      expect(this.$static.subjectHint).toHaveText('The subject should be a summary of your query'),
      expect(this.$inputs.queryDetail).toBeVisible(),
      expect(this.$static.detailHint).toBeVisible(),
      expect(this.$static.detailHint).toHaveText('Include as many details as possible so case workers can respond to your query'),
      expect(this.$static.hearingRelatedLabel).toBeVisible(),
      expect(this.$static.hearingRelatedYesLabel).toBeVisible(),
      expect(this.$static.hearingRelatedYesLabel).toHaveText('Yes'),
      expect(this.$static.hearingRelatedNoLabel).toBeVisible(),
      expect(this.$static.hearingRelatedNoLabel).toHaveText('No'),
      expect(this.$static.addDocumentHeading).toBeVisible(),
      expect(this.$static.documentHint).toBeVisible(),
      expect(this.$static.documentHint).toHaveText(
        'Only attach documents related to your query. For all other documents use your case management document upload function.',
      ),
    ]);
  }

  async completePageAndContinue(options: RaiseAQueryPageOptions): Promise<void> {
    await this.$inputs.querySubject.fill(options.querySubject);
    await expect(this.$inputs.querySubject).toHaveValue(options.querySubject);
    await this.$inputs.queryDetail.fill(options.queryDetail);
    await expect(this.$inputs.queryDetail).toHaveValue(options.queryDetail);
    await this.page.getByRole('radio', { name: options.isHearingRelated }).check();
    await expect(this.page.getByRole('radio', { name: options.isHearingRelated })).toBeChecked();

    if (options.isHearingRelated === 'Yes') {
      if (!options.dateOfHearing) {
        throw new Error('Date of hearing is required when the query is hearing related.');
      }
      await expect(this.$static.dateOfHearingLabel).toBeVisible();
      await this.$inputs.hearingDay.fill(options.dateOfHearing.day.toString());
      await this.$inputs.hearingMonth.fill(options.dateOfHearing.month.toString());
      await this.$inputs.hearingYear.fill(options.dateOfHearing.year.toString());
      await expect(this.$inputs.hearingDay).toHaveValue(options.dateOfHearing.day.toString());
      await expect(this.$inputs.hearingMonth).toHaveValue(options.dateOfHearing.month.toString());
      await expect(this.$inputs.hearingYear).toHaveValue(options.dateOfHearing.year.toString());
    }

    if (options.optionallyAttachDocument === 'Yes') {
      await this.$interactive.addNewDocumentButton.click();
      await expect(this.$static.attachADocumentHeading).toBeVisible();
      const nameOfFileToUpload = options.nameOfDocument ? options.nameOfDocument : 'Raise_A_Query.txt';

      await this.uiDocumentUploadHelper.uploadExuiDocument({
        fileInputElement: this.$inputs.chooseFileToUpload,
        nameOfFileToUpload: nameOfFileToUpload,
      });
    }

    await expect(async () => {
      if (await this.$inputs.querySubject.isVisible()) {
        this.$interactive.continueButton.click();
      }
      await expect(this.$inputs.querySubject).not.toBeVisible({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 30_000 });
  }
}
