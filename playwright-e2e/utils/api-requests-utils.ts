/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, APIRequestContext } from '@playwright/test';
import { DataUtils } from './data.utils';
import fs from 'fs';
import mime from 'mime-types';

const dataUtils = new DataUtils();

export async function cui_getCsrfToken(options: { apiContext: APIRequestContext; path: string; params?: Record<string, string> }): Promise<string> {
  let csrfToken: string | undefined;

  await expect(async () => {
    const response = await options.apiContext.get(options.path, {
      params: options.params,
    });
    await expect(response, { message: `Verify response is okay from ${options.path}` }).toBeOK();

    const html = await response.text();

    csrfToken = html.match(/<input[^>]*name="_csrf"[^>]*value="([^"]+)"/i)?.[1] ?? html.match(/[?&]_csrf=([^"&\s]+)/)?.[1];

    expect(csrfToken, { message: `Verify CSRF token for ${options.path}` }).toBeDefined();
  }).toPass({
    timeout: 20_000,
    intervals: [1_000],
  });

  return csrfToken!;
}

export async function cui_postForm(options: {
  apiContext: APIRequestContext;
  path: string;
  form: { [key: string]: string | number | boolean } | FormData;
}): Promise<void> {
  await expect(async () => {
    const response = await options.apiContext.post(options.path, {
      form: options.form,
    });

    await expect(response, {
      message: `Verify response is okay from ${options.path}`,
    }).toBeOK();
  }).toPass({
    timeout: 20_000,
    intervals: [1_000],
  });
}

export async function cui_uploadDocument(options: {
  apiContext: APIRequestContext;
  path: string;
  addtionalFields: Record<string, string>;
  fileUploadFieldName: string;
  nameOfFileToUpload: string;
}): Promise<void> {
  await expect(async () => {
    const filePath = await dataUtils.fetchDocumentUploadPath(options.nameOfFileToUpload);
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    const response = await options.apiContext.post(options.path, {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      multipart: {
        ...options.addtionalFields,
        [options.fileUploadFieldName]: {
          name: options.nameOfFileToUpload,
          mimeType: mimeType,
          buffer: fileBuffer,
        },
      },
    });

    expect(response.status()).toBeLessThan(400);
  }).toPass({
    timeout: 20_000,
    intervals: [1_000],
  });
}

export async function exui_triggerEvent(options: {
  apiContext: APIRequestContext;
  caseId: string;
  eventName: string;
}): Promise<{ eventToken: string; rawCaseData: Record<string, any> }> {
  let eventToken: string | undefined;
  let rawCaseData: Record<string, any> | undefined;

  await expect(async () => {
    const triggerResponse = await options.apiContext.get(
      `data/internal/cases/${options.caseId}/event-triggers/${options.eventName}?ignore-warning=false`,
      {
        headers: {
          accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.ui-start-event-trigger.v2+json;charset=UTF-8',
          experimental: 'true',
        },
      },
    );

    await expect(triggerResponse, { message: `Verify response when triggering event ${options.eventName} is successful` }).toBeOK();
    const responseBody = await triggerResponse.json();
    eventToken = responseBody.event_token;
    expect(eventToken, { message: `Verify event token is defined when triggering event ${options.eventName}` }).toBeDefined();

    rawCaseData = responseBody.case_fields.reduce((acc: Record<string, any>, field: any) => {
      acc[field.id] = field.value;
      return acc;
    }, {});

    if (!rawCaseData) {
      throw new Error(`Critical Error: No case data found in trigger response for event '${options.eventName}'.`);
    }
  }).toPass({
    timeout: 20_000,
    intervals: [1_000],
  });

  return { eventToken: eventToken!, rawCaseData: rawCaseData! };
}

export async function exui_uploadDocument(options: {
  apiContext: APIRequestContext;
  fileName: string;
  eventName: string;
}): Promise<{ documentBinaryUrl: string; documentFilename: string; documentHash: string; documentUrl: string }> {
  const filePath = await dataUtils.fetchDocumentUploadPath(options.fileName);
  const fileBuffer = fs.readFileSync(filePath);
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  const apiContext = options.apiContext;

  let documentBinaryUrl: string | undefined;
  let documentFilename: string | undefined;
  let documentHash: string | undefined;
  let documentUrl: string | undefined;

  await expect(async () => {
    const uploadDocumentResponse = await apiContext.post('documentsv2', {
      timeout: 15_000,
      multipart: {
        files: {
          name: options.fileName,
          mimeType: mimeType,
          buffer: fileBuffer,
        },
        classification: 'PUBLIC',
        caseTypeId: 'Asylum',
        jurisdictionId: 'IA',
      },
    });

    if (uploadDocumentResponse.status() === 429) {
      throw new Error('Received 429 Too Many Requests response from Document Store.');
    }

    await expect(uploadDocumentResponse, { message: `Verify document upload is succesful for event ${options.eventName}` }).toBeOK();
    const uploadDocumentBody = await uploadDocumentResponse.json();

    const docMetadata = uploadDocumentBody.documents[0];
    documentUrl = docMetadata?._links?.self?.href;
    documentBinaryUrl = docMetadata?._links?.binary?.href;
    documentFilename = docMetadata?.originalDocumentName;
    documentHash = docMetadata?.hashToken;

    expect(documentUrl, `Document Store response missing self link for event ${options.eventName}`).toBeDefined();
    expect(documentBinaryUrl, `Document Store response missing binary link for event ${options.eventName}`).toBeDefined();
    expect(documentFilename, `Document Store response missing filename for event ${options.eventName}`).toBeDefined();
    expect(documentHash, `Document Store response missing hash token for event ${options.eventName}`).toBeDefined();
  }).toPass({
    timeout: 40_000,
    intervals: [5_000],
  });

  return {
    documentBinaryUrl: documentBinaryUrl!,
    documentFilename: documentFilename!,
    documentHash: documentHash!,
    documentUrl: documentUrl!,
  };
}

export async function exui_submitEvent(options: {
  apiContext: APIRequestContext;
  caseId: string;
  payload: Record<string, any>;
  eventName: string;
  eventToken: string;
}): Promise<void> {
  const submissionResponse = await options.apiContext.post(`data/cases/${options.caseId}/events`, {
    timeout: 30_000,
    headers: {
      accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.create-event.v2+json;charset=UTF-8',
      experimental: 'true',
    },
    data: {
      data: options.payload,
      event: { id: options.eventName, summary: '', description: '' },
      event_token: options.eventToken,
      ignore_warning: false,
    },
  });

  await expect(submissionResponse, { message: `Verify event submission is successful for event ${options.eventName}` }).toBeOK();
}
