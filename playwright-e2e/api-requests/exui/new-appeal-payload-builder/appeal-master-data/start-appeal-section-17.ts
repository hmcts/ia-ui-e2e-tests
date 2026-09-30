interface StartAppealSection17Data {
  section17Document: {
    document_url: string;
    document_binary_url: string;
    document_filename: string;
    document_hash: string;
  };
}

export class StartAppealSection17 {
  public async section17Document(options: {
    document_url: string;
    document_binary_url: string;
    document_filename: string;
    document_hash: string;
  }): Promise<StartAppealSection17Data> {
    return {
      section17Document: {
        document_url: options.document_url,
        document_binary_url: options.document_binary_url,
        document_filename: options.document_filename,
        document_hash: options.document_hash,
      },
    };
  }
}
