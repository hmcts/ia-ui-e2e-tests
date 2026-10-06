import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class UploadHomeOfficeBundleSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    uploadButton: this.page.getByRole('button', { name: 'Upload', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    changeUplaodHomeOfficeBundleButton: this.page.locator('span[aria-label="Change Upload Home Office bundle"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Upload Home Office bundle', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    checkYourAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationText: this.page.locator('span', { hasText: 'Check the information' }),
    uploadHomeOfficeBundleText: this.page.locator('tr th span', { hasText: 'Upload Home Office bundle' }),
    tableTitle: this.page.locator('dl[class="complex-panel-title"]'),
    uploadAFileLabel: this.page.locator('[class*="complex-panel-simple-field"] span', { hasText: 'Upload a file' }),
    describeTheDocumentLabel: this.page.locator('[class*="complex-panel-simple-field"] span', { hasText: 'Describe the document' }),
    describeTheDocumentValue: this.page.locator('ccd-read-text-area-field span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/uploadHomeOfficeBundle/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async submitEvent(): Promise<void> {
    await this.navigationClick(this.$interactive.uploadButton);
  }
}
