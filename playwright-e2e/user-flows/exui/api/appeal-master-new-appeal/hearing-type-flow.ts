import {
  StartAppealHearingFeeDecision,
  StartAppealRemissionType,
  StartAppealRemissionClaim,
  StartAppealRemissionAsylumSupport,
  StartAppealLegalAid,
  StartAppealSection17,
  StartAppealSection20,
  StartAppealHomeOfficeWaiver,
  StartAppealRpdcAppealHearingOption,
  StartAppealHelpWithFees,
  StartAppealExceptionalCircumstancesRemission,
  StartAppealPaymentOptions,
} from '../../../../api-requests/exui/new-appeal-payload-builder/appeal-master-data/index.js';
import { ExuiAppealType, ExuiRemissionClaimType, HearingWihtoutFeeDecisionType, RemissionTypeOption } from '../../../../exui-event-types';
import { exui_uploadDocument } from '../../../../utils/api-requests-utils.js';
import { ApiContext } from '../../../../api-requests/api-context.js';
import { config } from '../../../../utils/config.utils.js';

type HearingTypeFlowOptions = {
  appealType: ExuiAppealType;
  hearingType: HearingWihtoutFeeDecisionType;
  feeRemissionType?: RemissionTypeOption;
  feeRemissionClaimType?: ExuiRemissionClaimType;
};

export class HearingTypeFlow {
  private apiContext = new ApiContext();
  private startAppealHearingFeeDecision = new StartAppealHearingFeeDecision();
  private startAppealRemissionType = new StartAppealRemissionType();
  private startAppealRemissionClaim = new StartAppealRemissionClaim();
  private startAppealRemissionAsylumSupport = new StartAppealRemissionAsylumSupport();
  private startAppealLegalAid = new StartAppealLegalAid();
  private startAppealSection17 = new StartAppealSection17();
  private startAppealSection20 = new StartAppealSection20();
  private startAppealHomeOfficeWaiver = new StartAppealHomeOfficeWaiver();
  private startAppealRpdcAppealHearingOption = new StartAppealRpdcAppealHearingOption();
  private startAppealHelpWithFees = new StartAppealHelpWithFees();
  private startAppealExceptionalCircumstancesRemission = new StartAppealExceptionalCircumstancesRemission();
  private startAppealPaymentOptions = new StartAppealPaymentOptions();

  // This method builds the payload for the hearing type flow based on the provided options.
  // It handles different appeal types, hearing types, fee remission types, and fee remission claim types and populates the payload accordingly.
  // It also includes document uploads for certain fee remission claim types in the payload.
  // This method builds a payload up until the point the user submits the appeal master application
  // The method returns the final payload as a JSON object.
  public async buildPayload(options: HearingTypeFlowOptions): Promise<JSON> {
    const payload: any = {};

    const addToPayload = (data: object): void => {
      Object.assign(payload, data);
    };

    const legalRepApiContext = await this.apiContext.createExuiApiContext({ userSessionFile: config.exuiUsers.legalRepUser.sessionFile });

    if (options.appealType === 'Deprivation of citizenship' || options.appealType === 'Revocation of a protection status') {
      if (options.feeRemissionType || options.feeRemissionClaimType) {
        throw new Error(
          'feeRemissionType and feeRemissionClaimType should not be provided when appealType is "Deprivation of citizenship" or "Revocation of a protection status" since these appeals have no fee associated with them',
        );
      }
      addToPayload(await this.startAppealRpdcAppealHearingOption.rpdcAppealHearingOption(options.hearingType));
    } else {
      if (!options.feeRemissionType) {
        throw new Error('feeRemissionType is required when appealType is not "Deprivation of citizenship" or "Revocation of a protection status"');
      }

      addToPayload(await this.startAppealHearingFeeDecision.hearingFeeDecision(options.hearingType));
      addToPayload(await this.startAppealRemissionType.remissionType(options.feeRemissionType));

      switch (options.feeRemissionType) {
        case 'The appellant is not eligible for a fee remission':
          if (options.appealType === 'Refusal of protection claim') {
            addToPayload(await this.startAppealPaymentOptions.paymentOptions('payNow'));
          }
          break;
        case 'The appellant has a remission, e.g. Asylum support, Legal Aid, Home Office waiver, Section 17/20':
          if (!options.feeRemissionClaimType) {
            throw new Error(
              'feeRemissionClaimType is required when feeRemissionType is "The appellant has a remission, e.g. Asylum support, Legal Aid, Home Office waiver, Section 17/20"',
            );
          }
          addToPayload(await this.startAppealRemissionClaim.remissionClaim(options.feeRemissionClaimType));

          switch (options.feeRemissionClaimType) {
            case 'The appellant receives Asylum Support':
              const asylumSupportDocumentUploadResponse = await exui_uploadDocument({
                apiContext: legalRepApiContext,
                fileName: 'Start_Appeal_Remission_Asylum_Support.txt',
                eventName: 'startAppeal',
              });

              addToPayload(
                await this.startAppealRemissionAsylumSupport.remissionAsylumSupport({
                  asylumSupportReference: 'ASR123456',
                  doYouWishToUploadDocument: 'Yes',
                  asylumSupportDocument: {
                    document_url: asylumSupportDocumentUploadResponse.documentUrl,
                    document_binary_url: asylumSupportDocumentUploadResponse.documentBinaryUrl,
                    document_filename: asylumSupportDocumentUploadResponse.documentFilename,
                    document_hash: asylumSupportDocumentUploadResponse.documentHash,
                  },
                }),
              );
              break;
            case 'The appellant receives Legal Aid':
              addToPayload(await this.startAppealLegalAid.legalAid({ legalAidAccountNumber: 123456789 }));
              break;
            case 'The appellant receives (or has parental responsibility for a person who receives) benefit services or accommodation provided by a local authority under section 17 of the Children Act 1989, section 22 of the Children (Scotland) Act 1995, article 18 of the Children (Northern Ireland) Order 1995 or section 37 of the Social Services and Well-being (Wales) Act 2014':
              const section17DocumentUploadResponse = await exui_uploadDocument({
                apiContext: legalRepApiContext,
                fileName: 'Start_Appeal_Section_17.txt',
                eventName: 'startAppeal',
              });
              addToPayload(
                await this.startAppealSection17.section17Document({
                  document_binary_url: section17DocumentUploadResponse.documentBinaryUrl,
                  document_filename: section17DocumentUploadResponse.documentFilename,
                  document_hash: section17DocumentUploadResponse.documentHash,
                  document_url: section17DocumentUploadResponse.documentUrl,
                }),
              );
              break;
            case "The appellant's accommodation is being provided by a local authority under section 20 of the Children Act 1989, section 25 of the Children (Scotland) Act 1995, article 21 of the Children (Northern Ireland) Order 1995 or section 76 of the Social Services and Well-being (Wales) Act 2014":
              const section20DocumentUploadResponse = await exui_uploadDocument({
                apiContext: legalRepApiContext,
                fileName: 'Start_Appeal_Section_20.txt',
                eventName: 'startAppeal',
              });
              addToPayload(
                await this.startAppealSection20.section20Document({
                  document_binary_url: section20DocumentUploadResponse.documentBinaryUrl,
                  document_filename: section20DocumentUploadResponse.documentFilename,
                  document_hash: section20DocumentUploadResponse.documentHash,
                  document_url: section20DocumentUploadResponse.documentUrl,
                }),
              );
              break;
            case 'The Home Office waived the fee for the application this appeal relates to':
              const homeofficeWavierDocumentUploadResponse = await exui_uploadDocument({
                apiContext: legalRepApiContext,
                fileName: 'Start_Appeal_Home_Office_Waiver.txt',
                eventName: 'startAppeal',
              });
              addToPayload(
                await this.startAppealHomeOfficeWaiver.homeOfficeWaiverDocument({
                  document_binary_url: homeofficeWavierDocumentUploadResponse.documentBinaryUrl,
                  document_filename: homeofficeWavierDocumentUploadResponse.documentFilename,
                  document_hash: homeofficeWavierDocumentUploadResponse.documentHash,
                  document_url: homeofficeWavierDocumentUploadResponse.documentUrl,
                }),
              );
              break;
          }
          break;
        case 'The appellant has applied for help with fees':
          addToPayload(await this.startAppealHelpWithFees.helpWithFeesReferenceNumber('HWF123456'));
          break;
        case 'The appellant wants to apply for an Exceptional Circumstances Remission':
          const documentUploadResponse = await exui_uploadDocument({
            apiContext: legalRepApiContext,
            fileName: 'Start_Appeal_Exceptional_Circumstances_Remission.txt',
            eventName: 'startAppeal',
          });

          addToPayload(
            await this.startAppealExceptionalCircumstancesRemission.exceptionalCircumstances({
              exceptionalCircumstancesDescription: 'Testing Exceptional Circumstances Remission',
              doYouWishToUploadEvidence: 'Yes',
              remissionEvidenceDocument: {
                document_url: documentUploadResponse.documentUrl,
                document_binary_url: documentUploadResponse.documentBinaryUrl,
                document_filename: documentUploadResponse.documentFilename,
                document_hash: documentUploadResponse.documentHash,
              },
            }),
          );
          break;
      }
    }
    return payload;
  }
}
