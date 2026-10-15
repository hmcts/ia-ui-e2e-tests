import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { UiDocumentUploadHelper } from '../../../../../../utils/ui-document-upload-helper';
import { YesOrNoType } from '../../../../../../citizen-types';

export class BuildCasePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly uiDocumentUploadHelper = new UiDocumentUploadHelper(this.page);

  public readonly $inputs = {
    appealSkeletonArgumentFile: this.page.locator('input[id="caseArgumentDocument"]'),
    appealSkeletonArgumentDescription: this.page.locator('textarea[id="caseArgumentDescription"]'),
    newEvidenceFile: this.page.locator('input[id^="caseArgumentEvidence_"][id$="_document"]'),
    newEvidenceDescription: this.page.locator('textarea[id^="caseArgumentEvidence_"][id$="_description"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    cancelUploadButton: this.page.getByRole('button', { name: 'Cancel upload', exact: true }),
    addEvidenceButton: this.page.getByRole('button', { name: 'Add new', exact: true }),
    removeEvidenceButton: this.page.getByRole('button', { name: 'Remove Evidence', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.getByText('Build your case', { exact: true }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Upload your argument and evidence', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    introductionParagraph: this.page.locator('[field_id="buildCaseTitle"] p').nth(0),
    instructionHeading: this.page.locator('[field_id="buildCaseTitle"] h2'),
    templateLink: this.page.getByRole('link', { name: 'Legal_Argument_Template_10_11_18.doc', exact: true }),
    adviceParagraph: this.page.locator('[field_id="buildCaseTitle"] p').nth(2),
    uploadAdviceHeading: this.page.locator('[field_id="buildCaseTitle"] h4'),
    uploadAdviceBullet: this.page.locator('[field_id="buildCaseTitle"] li'),
    appealSkeletonArgumentLabel: this.page.locator('label[for="caseArgumentDocument"]'),
    documentDescriptionLabel: this.page.locator('label[for="caseArgumentDescription"]'),
    uploadedFilesLabel: this.page.locator('[field_id="uploadedLegalRepBuildCaseDocs"] .case-field__label'),
    uploadedFilesValue: this.page.locator('[field_id="uploadedLegalRepBuildCaseDocs"] .case-field__value'),
    evidenceHeading: this.page.locator('[field_id="buildCaseEvidenceTitle"] h3'),
    evidenceOptionalHeading: this.page.locator('#caseArgumentEvidence h2'),
    evidenceItemHeading: this.page.locator('#caseArgumentEvidence_0_0 h3'),
    evidenceDocumentLabel: this.page.locator('label[for="caseArgumentEvidence_0_document"]'),
    evidenceDescriptionLabel: this.page.locator('label[for="caseArgumentEvidence_0_description"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/buildCase/buildCasebuildCase',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.introductionParagraph).toHaveText(
        'You must provide all the information for the Home Office to conduct a thorough review of their decision at this stage.',
      ),
      expect(this.$static.introductionParagraph).toBeVisible(),
      expect(this.$static.instructionHeading.nth(0)).toHaveText('1. Download the template below and use it to create your appeal skeleton argument.'),
      expect(this.$static.instructionHeading.nth(0)).toBeVisible(),
      expect(this.$static.templateLink).toBeVisible(),
      expect(this.$static.adviceParagraph).toHaveText(
        'Advice: Your appeal skeleton argument must explain why this appeal should be allowed. It must comply with the practice directions.',
      ),
      expect(this.$static.adviceParagraph).toBeVisible(),
      expect(this.$static.instructionHeading.nth(1)).toHaveText('2. Upload your appeal skeleton argument below.'),
      expect(this.$static.instructionHeading.nth(1)).toBeVisible(),
      expect(this.$static.uploadAdviceHeading).toHaveText('Advice on uploads'),
      expect(this.$static.uploadAdviceHeading).toBeVisible(),
      expect(this.$static.uploadAdviceBullet.nth(0)).toHaveText('Files must be no more than 100MB in size.'),
      expect(this.$static.uploadAdviceBullet.nth(0)).toBeVisible(),
      expect(this.$static.uploadAdviceBullet.nth(1)).toHaveText('Upload a Word doc or PDF file'),
      expect(this.$static.uploadAdviceBullet.nth(1)).toBeVisible(),
      expect(this.$static.uploadAdviceBullet.nth(2)).toHaveText(
        'Before uploading a file, give it a meaningful file name. For example, JSmith-Skeleton.pdf.',
      ),
      expect(this.$static.uploadAdviceBullet.nth(2)).toBeVisible(),
      expect(this.$static.appealSkeletonArgumentLabel).toHaveText('Appeal skeleton argument'),
      expect(this.$static.appealSkeletonArgumentLabel).toBeVisible(),
      expect(this.$static.documentDescriptionLabel).toHaveText('Describe the document (Optional)'),
      expect(this.$static.documentDescriptionLabel).toBeVisible(),
      expect(this.$static.uploadedFilesLabel).toHaveText('Already uploaded files:'),
      expect(this.$static.uploadedFilesLabel).toBeVisible(),
      expect(this.$static.uploadedFilesValue).toHaveText('- None'),
      expect(this.$static.uploadedFilesValue).toBeVisible(),
      expect(this.$static.evidenceHeading).toHaveText('3. Upload the evidence upon which you rely, including any witness statements.'),
      expect(this.$static.evidenceHeading).toBeVisible(),
      expect(this.$static.evidenceOptionalHeading).toHaveText('Evidence (Optional)'),
      expect(this.$static.evidenceOptionalHeading).toBeVisible(),
      expect(this.$interactive.addEvidenceButton).toBeVisible(),
      expect(this.$inputs.appealSkeletonArgumentDescription).toBeVisible(),
      expect(this.$interactive.continueButton).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: {
    appealSkeletonFileDescription?: string;
    addAddtionalNewEvidence: YesOrNoType;
    newEvidenceFileDescription?: string;
  }): Promise<void> {
    await this.uiDocumentUploadHelper.uploadExuiDocument({
      fileInputElement: this.$inputs.appealSkeletonArgumentFile,
      nameOfFileToUpload: 'Appeal_Skeleton_Argument.pdf',
    });

    if (options.appealSkeletonFileDescription) {
      await this.$inputs.appealSkeletonArgumentDescription.fill(options.appealSkeletonFileDescription);
    }

    if (options.addAddtionalNewEvidence === 'Yes') {
      await this.$interactive.addEvidenceButton.click();
      await Promise.all([
        expect(this.$static.evidenceItemHeading).toHaveText('Evidence'),
        expect(this.$static.evidenceItemHeading).toBeVisible(),
        expect(this.$static.evidenceDocumentLabel).toHaveText('Document (Optional)'),
        expect(this.$static.evidenceDocumentLabel).toBeVisible(),
        expect(this.$static.evidenceDescriptionLabel).toHaveText('Describe the document (Optional)'),
        expect(this.$static.evidenceDescriptionLabel).toBeVisible(),
        expect(this.$interactive.removeEvidenceButton).toBeVisible(),
      ]);

      await this.uiDocumentUploadHelper.uploadExuiDocument({
        fileInputElement: this.$inputs.newEvidenceFile,
        nameOfFileToUpload: 'New_Evidence.pdf',
      });

      if (options.newEvidenceFileDescription) {
        await this.$inputs.newEvidenceDescription.fill(options.newEvidenceFileDescription);
      }
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
