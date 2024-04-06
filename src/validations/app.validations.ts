import { ZodType, z } from 'zod';
import { createManyUnion } from '@/config/zod';
import i18n, { readOnlyLocales } from '@/config/i18n';
import { hasAcceptedFileTypes, hasFilesMaxSize } from '@/utils/file.utils';

const ACCEPTED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'svg'];
const MAX_IMAGE_SIZE = 5;
const fileSizeMaxErrorMessage = i18n.t('common:form.error.fileSizeMax', { size: MAX_IMAGE_SIZE + 'MB' });

const acceptedFileTypeErrorMessage = i18n.t('common:form.error.acceptedFileType', {
  fileTypes: ACCEPTED_IMAGE_TYPES.map((type: string) => '.' + type),
});

export const langSchema = createManyUnion(readOnlyLocales as typeof readOnlyLocales & [string, string, ...string[]]);
export const dateForAdvancedSearchSchema = z.array(z.coerce.date().nullable()).optional();

export const settingsSchema = z.object({
  lang: langSchema,
});

export const confirmDeletionSchema = z.object({
  confirmation: z.string(),
});

export const selectOptionSchema = z.object({
  label: z.string().nullable(),
  value: z.string().nullable(),
});

export const getSelectOptionSchema = (nullable = true): any => {
  const option = z.object({
    label: z.string().nullable(),
    value: nullable ? z.string().nullable() : z.string(),
  });

  return option;
};

export const tabRouteSearchParams = z.object({
  tab: z.string().optional(),
});

export const getSingleImageSchema = (imageSize = MAX_IMAGE_SIZE): ZodType<any, any, any> => {
  return (
    z
      .any()
      // file size validation
      .refine((files: File[]): boolean => {
        if (!files) return true;
        return !hasFilesMaxSize(files, imageSize);
      }, fileSizeMaxErrorMessage)
      // file types validation
      .refine((files: File[]): boolean => {
        if (!files?.length) return true;
        return hasAcceptedFileTypes(files, ACCEPTED_IMAGE_TYPES);
      }, acceptedFileTypeErrorMessage)
      .transform((files: File[]) => {
        if (!files || files.length === 0) return;
        return files[0];
      })
  );
};


