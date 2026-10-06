import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { UiDocumentUploadHelper } from '../../../../../../utils/ui-document-upload-helper';

export class CreateCaseSummaryPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    chooseAFileButton: this.page.locator('input[id="caseSummaryDocument"]'),
    cancelUploadButton: this.page.getByRole('button', { name: 'Cancel upload', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    documentDescriptionTextArea: this.page.locator('textarea[id="caseSummaryDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Create case summary', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    createACaseSummaryHeading: this.page.getByRole('heading', { level: 2, name: 'Create a case summary and upload it below', exact: true }),
    createACaseSummaryParagraph: this.page.locator('markdown', { hasText: 'Create a case summary and upload it below' }).locator('p'),
    uploadCaseSummaryHeading: this.page.getByRole('heading', { level: 4, name: 'Upload your case summary below', exact: true }),
    caseSummaryDocumentLabel: this.page.locator('label[for="caseSummaryDocument"]'),
    caseSummaryDescriptionLabel: this.page.locator('label[for="caseSummaryDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/createCaseSummary/createCaseSummarycreateCaseSummary',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.createACaseSummaryHeading).toBeVisible(),
      expect(this.$static.createACaseSummaryParagraph.nth(0)).toBeVisible(),
      expect(this.$static.createACaseSummaryParagraph.nth(0)).toHaveText('Use the case summary template provided to you.'),
      expect(this.$static.createACaseSummaryParagraph.nth(1)).toBeVisible(),
      expect(this.$static.createACaseSummaryParagraph.nth(1)).toHaveText(
        'You must use this template to summarise the most relevant information in the case. This will be used by all parties in the hearing. You do not need to complete all the fields in the template.',
      ),
      expect(this.$static.createACaseSummaryParagraph.nth(2)).toBeVisible(),
      expect(this.$static.createACaseSummaryParagraph.nth(2)).toHaveText(
        'Give the file a meaningful name before you upload it. For example, PA-54321-2019-Smith-CaseSummary.PDF',
      ),
      expect(this.$static.uploadCaseSummaryHeading).toBeVisible(),
      expect(this.$static.caseSummaryDocumentLabel).toHaveText('Case summary document'),
      expect(this.$static.caseSummaryDocumentLabel).toBeVisible(),
      expect(this.$static.caseSummaryDescriptionLabel).toHaveText('Describe the document (Optional)'),
      expect(this.$static.caseSummaryDescriptionLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { description?: string; nameOfFileToUpload?: string }): Promise<void> {
    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Create_Case_Summary.txt';

    await this.uiDocumentUploadHelper.uploadExuiDocument({
      fileInputElement: this.$interactive.chooseAFileButton,
      nameOfFileToUpload: fileToUpload,
    });

    if (options.description) {
      await this.$inputs.documentDescriptionTextArea.fill(options.description);
    }
    await expect(this.$inputs.documentDescriptionTextArea).toHaveValue(options.description ? options.description : '');

    await this.navigationClick(this.$interactive.continueButton);
  }
}
