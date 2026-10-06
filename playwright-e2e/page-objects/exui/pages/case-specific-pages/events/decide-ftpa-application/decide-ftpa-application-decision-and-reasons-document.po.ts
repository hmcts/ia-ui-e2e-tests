import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { UiDocumentUploadHelper } from '../../../../../../utils/ui-document-upload-helper';

export class DecideFtpaApplicationDecisionAndReasonsDocumentPage extends ExuiBase {
  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    chooseFileButton: this.page.locator('input[id="ftpaApplicationAppellantDocument"]'),
    cancelUploadButton: this.page.getByRole('button', { name: 'Cancel upload', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('span', { hasText: 'Decide FTPA application' }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    ftpaDecisionAndReasonsHeading: this.page.getByRole('heading', { level: 1, name: 'FTPA Decision and Reasons', exact: true }),
    adviceOnUploadsHeading: this.page.getByRole('heading', { level: 4, name: 'Advice on uploads', exact: true }),
    adviceOnUploadsBulletPoints: this.page.locator('markdown', { hasText: 'Advice on uploads' }).locator('li'),
    uploadFtpaDecisionAndReasonsHeading: this.page.getByRole('heading', { level: 4, name: 'Upload FTPA Decision and Reasons document', exact: true }),
    documentLabel: this.page.locator('label[for="ftpaApplicationAppellantDocument"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decideFtpaApplication/decideFtpaApplicationftpaAppellantDecisionAndReasonsDocument',
      pageHeading: this.$static.pageHeading,
    });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.ftpaDecisionAndReasonsHeading).toBeVisible(),
      expect(this.$static.adviceOnUploadsHeading).toBeVisible(),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(0)).toHaveText('files must be no more than 100MB in size'),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(0)).toBeVisible(),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(1)).toHaveText('You can upload jpg, png, svg, gif, doc and PDF files'),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(1)).toBeVisible(),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(2)).toHaveText(
        'before uploading a file, give it a meaningful file name. For example, FTPA-Decision-and-reasons-JSmith.pdf',
      ),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(2)).toBeVisible(),
      expect(this.$static.uploadFtpaDecisionAndReasonsHeading).toBeVisible(),
      expect(this.$static.documentLabel).toHaveText('Document'),
      expect(this.$static.documentLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string }): Promise<void> {
    await this.verifyAllTextOnPage();

    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Ftpa_Decision_And_Reasons.txt';

    await this.uiDocumentUploadHelper.uploadExuiDocument({
      fileInputElement: this.$interactive.chooseFileButton,
      nameOfFileToUpload: fileToUpload,
    });

    await this.navigationClick(this.$interactive.continueButton);
  }
}
