interface StartAppealSection20Data {
  section20Document: {
    document_url: string;
    document_binary_url: string;
    document_filename: string;
    document_hash: string;
  };
}

export class StartAppealSection20 {
  public async section20Document(options: {
    document_url: string;
    document_binary_url: string;
    document_filename: string;
    document_hash: string;
  }): Promise<StartAppealSection20Data> {
    return {
      section20Document: {
        document_url: options.document_url,
        document_binary_url: options.document_binary_url,
        document_filename: options.document_filename,
        document_hash: options.document_hash,
      },
    };
  }
}
