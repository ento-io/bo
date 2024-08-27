import { z } from 'zod';

import { isNaN } from 'lodash';
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
    .min(1, i18n.t('form.error.required', { field: i18n.t('estimates.estimate') })),
  unitPrice: z
    .preprocess((val) => {
      const parsed = parseFloat(val as string);
      return isNaN(parsed) ? undefined : parsed;
    }, z.number()
      .min(0.01, i18n.t('form.error.min', { field: i18n.t('unitPrice'), number: 0.01 }))
      .max(100000, i18n.t('form.error.max', { field: i18n.t('unitPrice'), number: 100000 }))),
  quantity: z
    .preprocess((val) => {
      const parsed = parseFloat(val as string);
      return isNaN(parsed) ? undefined : parsed;
    }, z.number()
      .min(1, i18n.t('form.error.min', { field: i18n.t('quantity'), number: 1 }))
      .max(100000, i18n.t('form.error.max', { field: i18n.t('quantity'), number: 100000 }))),
  });

export const invoiceFilterSchema = invoiceSchema;


export const sendInvoiceSchema = sendEmailSchema.pick({ email: true, subject: true });
