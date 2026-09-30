import { YesOrNoType } from '../../../../citizen-types';
import { v4 as uuidv4 } from 'uuid';

interface StartAppealExceptionalCircumstancesRemissionData {
  exceptionalCircumstances: string;
  remissionEcEvidenceDocuments:
    | [
        {
          id: string;
          value: {
            document_url: string;
            document_binary_url: string;
            document_filename: string;
            document_hash: string;
          };
        },
      ]
    | [];
}

export class StartAppealExceptionalCircumstancesRemission {
  public async exceptionalCircumstances(options: {
    exceptionalCircumstancesDescription: string;
    doYouWishToUploadEvidence: YesOrNoType;
    remissionEvidenceDocument?: {
      document_url: string;
      document_binary_url: string;
      document_filename: string;
      document_hash: string;
    };
  }): Promise<StartAppealExceptionalCircumstancesRemissionData> {
    if (options.doYouWishToUploadEvidence === 'Yes' && !options.remissionEvidenceDocument) {
      throw new Error('remissionEvidenceDocument is required when doYouWishToUploadEvidence is "Yes"');
    }

    return {
      exceptionalCircumstances: options.exceptionalCircumstancesDescription,
      remissionEcEvidenceDocuments:
        options.doYouWishToUploadEvidence === 'Yes' && options.remissionEvidenceDocument
          ? [
              {
                id: uuidv4(),
                value: {
                  document_url: options.remissionEvidenceDocument.document_url,
                  document_binary_url: options.remissionEvidenceDocument.document_binary_url,
                  document_filename: options.remissionEvidenceDocument.document_filename,
                  document_hash: options.remissionEvidenceDocument.document_hash,
                },
              },
            ]
          : [],
    };
  }
}
