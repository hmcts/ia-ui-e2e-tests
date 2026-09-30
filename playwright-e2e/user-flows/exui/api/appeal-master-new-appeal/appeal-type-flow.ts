import {
  StartAppealAppealType,
  StartAppealAppealGroundsHumanRightsRefusal,
  StartAppealHomeOfficeDecisionLetter,
  StartAppealUploadTheNoticeOfDecision,
  StartAppealAppealGroundsEuRefusal,
  StartAppealAppealGroundsDeprivation,
  StartAppealAppealGroundsProtection,
  StartAppealAppealGroundsRevocation,
  StartAppealEntryClearanceDecisionLetter,
} from '../../../../api-requests/exui/new-appeal-payload-builder/appeal-master-data';
import { YesOrNoType } from '../../../../citizen-types';
import { ExuiAppealType, OutOfCountryDecisionType } from '../../../../exui-event-types';
import { exui_uploadDocument } from '../../../../utils/api-requests-utils.js';
import { ApiContext } from '../../../../api-requests/api-context.js';
import { config } from '../../../../utils/config.utils.js';

type AppealTypeFlowOptions = {
  appealType: ExuiAppealType;
  isAppellantInUk: YesOrNoType;
  oocDecisionType?: OutOfCountryDecisionType;
  decisionDate: { day: number; month: number; year: number };
};

export class AppealTypeFlow {
  private apiContext = new ApiContext();
  private startAppealAppealType = new StartAppealAppealType();
  private startAppealAppealGroundsHumanRightsRefusal = new StartAppealAppealGroundsHumanRightsRefusal();
  private startAppealHomeOfficeDecisionLetter = new StartAppealHomeOfficeDecisionLetter();
  private startAppealUploadTheNoticeOfDecision = new StartAppealUploadTheNoticeOfDecision();
  private startAppealAppealGroundsEuRefusal = new StartAppealAppealGroundsEuRefusal();
  private startAppealAppealGroundsDeprivation = new StartAppealAppealGroundsDeprivation();
  private startAppealAppealGroundsProtection = new StartAppealAppealGroundsProtection();
  private startAppealAppealGroundsRevocation = new StartAppealAppealGroundsRevocation();
  private startAppealEntryClearanceDecisionLetter = new StartAppealEntryClearanceDecisionLetter();

  // This method builds the payload for the appeal type flow based on the provided options.
  // It handles different appeal types and populates the payload accordingly.
  // It also includes decision letter date or home office decision date and notice of decision document upload in the payload.
  // This method builds a payload up until the point the user has to complete whether they have a sponsor or not flow
  public async buildPayload(options: AppealTypeFlowOptions): Promise<JSON> {
    const payload: any = {};

    const addToPayload = (data: object): void => {
      Object.assign(payload, data);
    };

    const legalRepApiContext = await this.apiContext.createExuiApiContext({ userSessionFile: config.exuiUsers.legalRepUser.sessionFile });

    addToPayload(await this.startAppealAppealType.appealType(options.appealType));

    switch (options.appealType) {
      case 'Refusal of a human rights claim':
        addToPayload(await this.startAppealAppealGroundsHumanRightsRefusal.appealGroundsDecisionHumanRightsRefusal());
        break;
      case 'Refusal of application under the EEA regulations':
        addToPayload(await this.startAppealAppealGroundsEuRefusal.appealGroundsDecisionEuRefusal());
        break;
      case 'Deprivation of citizenship':
        addToPayload(
          await this.startAppealAppealGroundsDeprivation.appealGroundsDeprivation({
            appealGroundsDeprivation: [
              'Deprivation would have a disproportionate effect',
              'The decision is unlawful because discretion should have been exercised differently',
            ],
            appealGroundsDeprivationHumanRights: 'Removing the appellant from the UK would be unlawful under section 6 of the Human Rights Act 1998',
          }),
        );
        break;
      case 'Refusal of protection claim':
        addToPayload(
          await this.startAppealAppealGroundsProtection.appealGroundsProtection({
            appealGroundsProtection: [
              "Removing the appellant from the UK would breach the UK's obligation in relation to persons eligible for a grant of humanitarian protection",
              "Removing the appellant from the UK would breach the UK's obligation under the Refugee Convention",
            ],
            appealGroundsHumanRights: 'Removing the appellant from the UK would be unlawful under section 6 of the Human Rights Act 1998',
          }),
        );
        break;
      case 'Revocation of a protection status':
        addToPayload(
          await this.startAppealAppealGroundsRevocation.appealGroundsRevocation({
            groundsForAppeal: [
              "Revocation of the appellant's protection status breaches the United Kingdom's obligations in relation to persons eligible for humanitarian protection",
              "Revocation of the appellant's protection status breaches the United Kingdom's obligations under the Refugee Convention",
            ],
          }),
        );
        break;
    }

    if (options.isAppellantInUk === 'No' && !options.oocDecisionType) {
      throw new Error('oocDecisionType is required when isAppellantInUk is "No"');
    } else if (
      (options.isAppellantInUk === 'No' &&
        options.oocDecisionType ===
          'A decision either 1) to refuse a human rights claim made following an application for entry clearance or 2) to refuse a permit to enter the UK under the Immigration (European Economic Area) Regulation 2016') ||
      options.oocDecisionType ===
        'A decision to refuse a permit to enter the UK or entry clearance under the immigration rules and/or the EU Settlement Scheme.'
    ) {
      addToPayload(
        await this.startAppealEntryClearanceDecisionLetter.decisionLetterDate({
          day: options.decisionDate.day,
          month: options.decisionDate.month,
          year: options.decisionDate.year,
        }),
      );
    } else if (options.isAppellantInUk === 'No') {
      addToPayload(
        await this.startAppealHomeOfficeDecisionLetter
          .homeOfficeDecisionDate({
            day: options.decisionDate.day,
            month: options.decisionDate.month,
            year: options.decisionDate.year,
          })
          .then((data) => {
            // remove homeOfficeDecisionDate from the returned data as it is not required for the following oocDecisionType values
            const { homeOfficeDecisionDate, ...rest } = data;
            return rest;
          }),
      );
    } else {
      addToPayload(
        await this.startAppealHomeOfficeDecisionLetter
          .homeOfficeDecisionDate({
            day: options.decisionDate.day,
            month: options.decisionDate.month,
            year: options.decisionDate.year,
          })
          .then((data) => {
            // remove decisionLetterReceivedDate from the returned data as it is not required for in country flow
            const { decisionLetterReceivedDate, ...rest } = data;
            return rest;
          }),
      );
    }

    const documentUploadResponse = await exui_uploadDocument({
      apiContext: legalRepApiContext,
      fileName: 'Upload_The_Notice_Of_Decision.txt',
      eventName: 'startAppeal',
    });
    addToPayload(
      await this.startAppealUploadTheNoticeOfDecision.uploadTheNoticeOfDecisionDocs({
        documentDescription: 'Notice of Decision',
        documentData: {
          document_url: documentUploadResponse.documentUrl,
          document_filename: documentUploadResponse.documentFilename,
          document_binary_url: documentUploadResponse.documentBinaryUrl,
          document_hash: documentUploadResponse.documentHash,
        },
      }),
    );

    return payload;
  }
}
