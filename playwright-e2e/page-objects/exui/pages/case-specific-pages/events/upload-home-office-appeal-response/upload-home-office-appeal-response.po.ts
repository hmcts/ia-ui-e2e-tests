import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { UiDocumentUploadHelper } from '../../../../../../utils/ui-document-upload-helper';

export class UploadHomeOfficeAppealResponsePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $inputs = {
    describeDocumentTextArea: this.page.locator('textarea[id="homeOfficeAppealResponseDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    addNewButton: this.page.getByRole('button', { name: 'Add new', exact: true }),
    removeButton: this.page.locator('button', { hasText: 'Remove' }),
    chooseFileButton: this.page.locator('input[id="homeOfficeAppealResponseDocument"]'),
    cancelUploadButton: this.page.getByRole('button', { name: 'Cancel upload', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Upload the appeal response', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    filesShouldBeHeading: this.page.getByRole('heading', { level: 4, name: 'Files should be:', exact: true }),
    filesShouldBeBulletPoint1: this.page.locator('markdown', { hasText: 'Files should be:' }).locator('li').nth(0),
    filesShouldBeBulletPoint2: this.page.locator('markdown', { hasText: 'Files should be:' }).locator('li').nth(1),
    filesShouldBeBulletPoint3: this.page.locator('markdown', { hasText: 'Files should be:' }).locator('li').nth(2),
    alreadyUploadedFilesLabel: this.page.locator('dt[class="case-field__label"]'),
    fileUploaded1: this.page.locator('dd[class="case-field__value"] span').nth(0),
    documentLabel: this.page.locator('label[for="homeOfficeAppealResponseDocument"]'),
    documentDesciptionLabel: this.page.locator('label[for="homeOfficeAppealResponseDescription"]'),
    documentDescriptionHint: this.page.getByText('For example,'),
    additionalEvidenceHeading: this.page.getByRole('heading', { level: 2, name: 'Add any additional evidence here (Optional)', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/uploadHomeOfficeAppealResponse/uploadHomeOfficeAppealResponsehomeOfficeAppealResponse',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.filesShouldBeHeading).toBeVisible(),
      expect(this.$static.filesShouldBeBulletPoint1).toHaveText('a maximum of 100MB in size (larger files must be split)'),
      expect(this.$static.filesShouldBeBulletPoint1).toBeVisible(),
      expect(this.$static.filesShouldBeBulletPoint2).toHaveText('labelled clearly, e.g. HOappealresponse.pdf'),
      expect(this.$static.filesShouldBeBulletPoint2).toBeVisible(),
      expect(this.$static.filesShouldBeBulletPoint3).toHaveText(
        'in Word or PDF format - other file formats must be sent to both the appellant and Tribunal',
      ),
      expect(this.$static.filesShouldBeBulletPoint3).toBeVisible(),
      expect(this.$static.alreadyUploadedFilesLabel).toHaveText('Already uploaded files:'),
      expect(this.$static.alreadyUploadedFilesLabel).toBeVisible(),
      expect(this.$static.fileUploaded1).toHaveText('- None'),
      expect(this.$static.fileUploaded1).toBeVisible(),
      expect(this.$static.documentLabel).toHaveText('Upload the appeal response'),
      expect(this.$static.documentLabel).toBeVisible(),
      expect(this.$static.documentDesciptionLabel).toHaveText('Describe the document (Optional)'),
      expect(this.$static.documentDesciptionLabel).toBeVisible(),
      expect(this.$static.documentDescriptionHint).toHaveText('For example, Home Office response to appeal'),
      expect(this.$static.documentDescriptionHint).toBeVisible(),
      expect(this.$static.additionalEvidenceHeading).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { description?: string; nameOfFileToUpload?: string }): Promise<void> {
    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Home_Office_Appeal_Reason.txt';

    await this.uiDocumentUploadHelper.uploadExuiDocument({
      fileInputElement: this.$interactive.chooseFileButton,
      nameOfFileToUpload: fileToUpload,
    });

    if (options.description) {
      await this.$inputs.describeDocumentTextArea.fill(options.description);
      await expect(this.$inputs.describeDocumentTextArea).toHaveValue(options.description);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
