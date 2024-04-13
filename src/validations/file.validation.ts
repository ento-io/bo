import { z, ZodType } from 'zod';

import i18n from '@/config/i18n';

import { hasAcceptedFileTypes, hasFilesMaxSize } from '@/utils/file.utils';

export const PAGE_SINGLE_IMAGE_FIELDS = ['bannerImage', 'previewImage'];
export const PAGE_IMAGES_FIELDS = ['images'];

const ACCEPTED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'svg'];
const MAX_IMAGE_SIZE = 5; // in MB
const fileSizeMaxErrorMessage = i18n.t('common:form.error.fileSizeMax', { size: MAX_IMAGE_SIZE + 'MB' });
const acceptedFileTypeErrorMessage = i18n.t('common:form.error.acceptedFileType', {
  fileTypes: ACCEPTED_IMAGE_TYPES.map((type: string) => '.' + type),
});

/**
 * single file upload schema
 * it accepts only one file (the form has multiple files, so we need to transform it to a single file)
 * and the file size is limited to 5Mo
 * @param imageSize default 5Mo
 * @returns 
 */
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

/**
 * multiple files upload schema
 * and the file size is limited to 5Mo
 * @param imageSize default 5Mo
 * @returns 
 */
export const getMultipleImagesSchema = (imageSize = MAX_IMAGE_SIZE): ZodType<any, any, any> => {
  return z
    .any()
    .refine((files: File[]) => {
      if (!files?.length) return true;
      return !hasFilesMaxSize(files, imageSize);
    }, fileSizeMaxErrorMessage)
    // file types validation
    .refine((files: File[]): boolean => {
      if (!files?.length) return true;
      return hasAcceptedFileTypes(files, ACCEPTED_IMAGE_TYPES);
    }, acceptedFileTypeErrorMessage);
};
