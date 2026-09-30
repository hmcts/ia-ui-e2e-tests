import { YesOrNoType } from '../../../../citizen-types';

interface StartAppealRemissionAsylumSupportData {
  asylumSupportReference: string;
  asylumSupportDocument?: {
    document_url: string;
    document_binary_url: string;
    document_filename: string;
    document_hash: string;
  };
}

export class StartAppealRemissionAsylumSupport {
  public async remissionAsylumSupport(options: {
    asylumSupportReference: string;
    doYouWishToUploadDocument: YesOrNoType;
    asylumSupportDocument?: {
      document_url: string;
      document_binary_url: string;
      document_filename: string;
      document_hash: string;
    };
  }): Promise<StartAppealRemissionAsylumSupportData> {
    switch (options.doYouWishToUploadDocument) {
      case 'Yes':
        if (!options.asylumSupportDocument) {
          throw new Error('Asylum support document details must be provided when user wishes to upload a document.');
        }
        return {
          asylumSupportReference: options.asylumSupportReference,
          asylumSupportDocument: {
            document_url: options.asylumSupportDocument.document_url,
            document_binary_url: options.asylumSupportDocument.document_binary_url,
            document_filename: options.asylumSupportDocument.document_filename,
            document_hash: options.asylumSupportDocument.document_hash,
          },
        };
      case 'No':
        return {
          asylumSupportReference: options.asylumSupportReference,
        };
    }
  }
}
