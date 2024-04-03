import { http, protectRequest } from '@/config/http';

import { IInvoiceAPIInput, IInvoiceGenerationBody } from '@/types/invoice.type';

/**
 * generate invoice api
 * @param id invoice id
 * @param sessionToken token of the current user
 * @param reference
 * @returns
 */
export const generateAndDownloadInvoicePDFApi = async ({ sessionToken, id, reference }: IInvoiceAPIInput): Promise<any> => {
  const body = { id, reference };
  const response = await http.post<IInvoiceGenerationBody, any>('/invoices/pdf', body, protectRequest(sessionToken, false));

  return response;
};
