import { object, string } from 'zod';
import  i18n from '@/config/i18n';



export const estimateSchema = object({ 
  estimate: string().url({ message: i18n.t('invalid.url') }).startsWith("https://", { message: "Must provide secure URL" })
});
