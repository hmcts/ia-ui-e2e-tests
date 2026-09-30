import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { UiDocumentUploadHelper } from '../../../../utils/ui-document-upload-helper';

export class StartAppealSection17Page extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    section17DocumentUploadInput: this.page.locator('input[id="section17Document"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Section 17', exact: true }),
    section17AdviceParagraph: this.page.locator('[id="section17Advice"] p'),
    localAuthorityLetterLabel: this.page.locator('label[for="section17Document"] span.form-label'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealsection17',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.section17AdviceParagraph).toBeVisible(),
      expect(this.$static.section17AdviceParagraph).toHaveText(
        "You need to provide a copy of a letter from the local authority confirming the appellant's benefit or accommodation support.",
      ),
      expect(this.$static.localAuthorityLetterLabel).toBeVisible(),
      expect(this.$static.localAuthorityLetterLabel).toHaveText('Local authority letter'),
    ]);
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string }): Promise<void> {
    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Start_Appeal_Section_17.txt';

    await this.uiDocumentUploadHelper.uploadExuiDocument({
      fileInputElement: this.$interactive.section17DocumentUploadInput,
      nameOfFileToUpload: fileToUpload,
    });

    await this.navigationClick(this.$interactive.continueButton);
  }
}
