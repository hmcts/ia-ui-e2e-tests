interface StartAppealHomeOfficeWaiverData {
  homeOfficeWaiverDocument: {
    document_url: string;
    document_binary_url: string;
    document_filename: string;
    document_hash: string;
  };
}

export class StartAppealHomeOfficeWaiver {
  public async homeOfficeWaiverDocument(options: {
    document_url: string;
    document_binary_url: string;
    document_filename: string;
    document_hash: string;
  }): Promise<StartAppealHomeOfficeWaiverData> {
    return {
      homeOfficeWaiverDocument: {
        document_url: options.document_url,
        document_binary_url: options.document_binary_url,
        document_filename: options.document_filename,
        document_hash: options.document_hash,
      },
    };
  }
}
