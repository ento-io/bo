import { z, ZodType } from 'zod';

import i18n from '@/config/i18n';

import { hasAcceptedFileTypes, hasFilesMaxSize } from '@/utils/file.utils';

const ACCEPTED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'svg'];
const MAX_IMAGE_SIZE = 5;
const fileSizeMaxErrorMessage = i18n.t('common:form.error.fileSizeMax', { size: MAX_IMAGE_SIZE + 'MB' });
const acceptedFileTypeErrorMessage = i18n.t('common:form.error.acceptedFileType', {
  fileTypes: ACCEPTED_IMAGE_TYPES.map((type: string) => '.' + type),
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

export const imagesFieldSchema = z
  .any()
  .refine((files: File[]) => {
    if (!files?.length) return true;
    return !hasFilesMaxSize(files, MAX_IMAGE_SIZE);
  }, fileSizeMaxErrorMessage)
  // file types validation
  .refine((files: File[]): boolean => {
    if (!files?.length) return true;
    return hasAcceptedFileTypes(files, ACCEPTED_IMAGE_TYPES);
  }, acceptedFileTypeErrorMessage);
