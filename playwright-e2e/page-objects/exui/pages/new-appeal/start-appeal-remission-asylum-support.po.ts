import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { UiDocumentUploadHelper } from '../../../../utils/ui-document-upload-helper';

export class StartAppealRemissionAsylumSupportPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $inputs = {
    asylumSupportReferenceInput: this.page.locator('input[id="asylumSupportReference"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    asylumSupportDocumentUploadInput: this.page.locator('input[id="asylumSupportDocument"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Asylum support', exact: true }),
    asylumSupportAdviceParagraph: this.page.locator('[id="asylumSupportAdvice"] p'),
    asylumSupportReferenceLabel: this.page.locator('label[for="asylumSupportReference"] span.form-label'),
    asylumSupportReferenceHint: this.page.locator('label[for="asylumSupportReference"] ~ span.form-hint'),
    asylumSupportConfirmationLetterLabel: this.page.locator('label[for="asylumSupportDocument"] span.form-label'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealremissionAsylumSupport',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.asylumSupportAdviceParagraph.nth(0)).toBeVisible(),
      expect(this.$static.asylumSupportAdviceParagraph.nth(0)).toHaveText(
        'Enter the Asylum Support reference number. You can find this on the Asylum Support confirmation letter your client received from the Home Office.',
      ),
      expect(this.$static.asylumSupportReferenceLabel).toBeVisible(),
      expect(this.$static.asylumSupportReferenceLabel).toHaveText('Asylum Support reference number'),
      expect(this.$static.asylumSupportReferenceHint).toBeVisible(),
      expect(this.$static.asylumSupportReferenceHint).toHaveText('For example, 20/02/1234'),
      expect(this.$static.asylumSupportConfirmationLetterLabel).toBeVisible(),
      expect(this.$static.asylumSupportConfirmationLetterLabel).toHaveText('Asylum Support confirmation letter (Optional)'),
    ]);
  }

  public async completePageAndContinue(options: {
    asylumSupportReferenceNumber: string;
    uploadFile: boolean;
    nameOfFileToUpload?: string;
  }): Promise<void> {
    await this.$inputs.asylumSupportReferenceInput.fill(options.asylumSupportReferenceNumber);
    await expect(this.$inputs.asylumSupportReferenceInput).toHaveValue(options.asylumSupportReferenceNumber);

    if (options.uploadFile) {
      const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Start_Appeal_Remission_Asylum_Support.txt';
      await this.uiDocumentUploadHelper.uploadExuiDocument({
        fileInputElement: this.$interactive.asylumSupportDocumentUploadInput,
        nameOfFileToUpload: fileToUpload,
      });
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
