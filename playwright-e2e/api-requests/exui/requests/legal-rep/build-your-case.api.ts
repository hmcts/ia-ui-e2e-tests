import { APIRequestContext } from '@playwright/test';
import { BuildYourCaseEventType } from '../../../../exui-event-types';
import { exui_triggerEvent, exui_uploadDocument, exui_submitEvent } from '../../../../utils/api-requests-utils';

export class BuildYourCaseApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  private readonly eventName = 'buildCase';

  public async submitEvent(options: BuildYourCaseEventType): Promise<void> {
    const triggerResponse = await exui_triggerEvent({ apiContext: this.apiContext, caseId: options.caseId, eventName: this.eventName });

    const expectedKeysInEventPayload = [
      'appellantInDetention',
      'caseArgumentDescription',
      'caseArgumentDocument',
      'caseArgumentEvidence',
      'isNotificationTurnedOff',
      'uploadedLegalRepBuildCaseDocs',
    ];

    for (const key of expectedKeysInEventPayload) {
      if (!(key in triggerResponse.rawCaseData)) {
        throw new Error(`Critical Error: Expected field '${key}' not found in case record for createCaseSummary event.`);
      }
    }

    const appealSkeletonDocumentData = await exui_uploadDocument({
      apiContext: this.apiContext,
      fileName: 'Appeal_Skeleton_Argument.pdf',
      eventName: this.eventName,
    });

    let newEvidenceDocumentData;
    if (options.addAddtionalNewEvidence === 'Yes') {
      newEvidenceDocumentData = await exui_uploadDocument({
        apiContext: this.apiContext,
        fileName: 'New_Evidence.pdf',
        eventName: this.eventName,
      });
    }

    const finalData = expectedKeysInEventPayload.reduce((acc: Record<string, string | object>, key) => {
      if (key === 'caseArgumentDescription' && options.appealSkeletonFileDescription) acc[key] = options.appealSkeletonFileDescription;
      else if (key === 'caseArgumentDocument') {
        acc[key] = {
          document_url: appealSkeletonDocumentData.documentUrl,
          document_binary_url: appealSkeletonDocumentData.documentBinaryUrl,
          document_filename: appealSkeletonDocumentData.documentFilename,
          document_hash: appealSkeletonDocumentData.documentHash,
        };
      } else if (key === 'caseArgumentEvidence' && options.addAddtionalNewEvidence === 'Yes') {
        acc[key] = [
          {
            id: null,
            value: {
              description: options.newEvidenceFileDescription ?? null,
              document: {
                document_url: newEvidenceDocumentData.documentUrl,
                document_binary_url: newEvidenceDocumentData.documentBinaryUrl,
                document_filename: newEvidenceDocumentData.documentFilename,
                document_hash: newEvidenceDocumentData.documentHash,
              },
            },
          },
        ];
      } else {
        acc[key] = triggerResponse.rawCaseData[key];
      }
      return acc;
    }, {});

    await exui_submitEvent({
      apiContext: this.apiContext,
      caseId: options.caseId,
      eventName: this.eventName,
      eventToken: triggerResponse.eventToken,
      payload: finalData,
    });
  }
}
