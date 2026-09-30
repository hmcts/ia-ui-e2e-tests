import { v4 as uuidv4 } from 'uuid';
interface startAppealUploadTheNoticeOfDecisionData {
  uploadTheNoticeOfDecisionDocs: [
    {
      value: {
        description: string;
        document: {
          document_url: string;
          document_binary_url: string;
          document_filename: string;
          document_hash: string;
        };
      };
      id: string;
    },
  ];
}

export class StartAppealUploadTheNoticeOfDecision {
  public async uploadTheNoticeOfDecisionDocs(options: {
    documentDescription: string;
    documentData: {
      document_url: string;
      document_binary_url: string;
      document_filename: string;
      document_hash: string;
    };
  }): Promise<startAppealUploadTheNoticeOfDecisionData> {
    return {
      uploadTheNoticeOfDecisionDocs: [
        {
          value: {
            description: options.documentDescription,
            document: {
              document_url: options.documentData.document_url,
              document_binary_url: options.documentData.document_binary_url,
              document_filename: options.documentData.document_filename,
              document_hash: options.documentData.document_hash,
            },
          },
          id: uuidv4(),
        },
      ],
    };
  }
}
