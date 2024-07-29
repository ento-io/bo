import { z } from 'zod';

import i18n from '@/config/i18n';
import { sendEmailSchema } from './email.validation';


export const invoiceSchema = z.object({
  supplierName: z
    .string()
    .trim()
    .min(1, i18n.t('form.error.required', { field: i18n.t('supplierName') }))
    .max(60, i18n.t('form.error.max', { field: i18n.t('supplierName'), number: 60 })),
  estimate: z
    .string()
    .min(1, i18n.t('form.error.required', { field: i18n.t('estimates.estimate') }))
});

export const invoiceFilterSchema = invoiceSchema;


export const sendInvoiceSchema = sendEmailSchema.pick({ email: true, subject: true });
