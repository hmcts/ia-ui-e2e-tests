import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { UiDocumentUploadHelper } from '../../../../utils/ui-document-upload-helper';

export class StartAppealSection20Page extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    section20DocumentUploadInput: this.page.locator('input[id="section20Document"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Section 20', exact: true }),
    section20AdviceParagraph: this.page.locator('[id="section20Advice"] p'),
    localAuthorityLetterLabel: this.page.locator('label[for="section20Document"] span.form-label'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealsection20',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.section20AdviceParagraph).toBeVisible(),
      expect(this.$static.section20AdviceParagraph).toHaveText(
        "You need to provide a copy of a letter from the local authority confirming the appellant's benefit or accommodation support.",
      ),
      expect(this.$static.localAuthorityLetterLabel).toBeVisible(),
      expect(this.$static.localAuthorityLetterLabel).toHaveText('Local authority letter'),
    ]);
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string }): Promise<void> {
    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Start_Appeal_Section_20.txt';

    await this.uiDocumentUploadHelper.uploadExuiDocument({
      fileInputElement: this.$interactive.section20DocumentUploadInput,
      nameOfFileToUpload: fileToUpload,
    });

    await this.navigationClick(this.$interactive.continueButton);
  }
}
