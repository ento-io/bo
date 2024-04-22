import { useCallback, useEffect, useState } from 'react';

import { Box, FormHelperText, Stack, styled, Typography, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { uniqBy } from 'lodash';
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { FaFileUpload } from 'react-icons/fa';
import { FiRefreshCcw } from 'react-icons/fi';

import { convertFileSizeToBytes } from '@/utils/file.utils';

import FilesPreview from './FilesPreview';
import ImagesPreview from './ImagesPreview';
import InputActionButton from './InputActionButton';

// -------------- styled dropzone -------------- //
type StyleDropzoneProps = {
  error: boolean;
};
const StyledDropzone = styled('div', {
  shouldForwardProp: prop => prop !== 'error',
})<StyleDropzoneProps>(({ theme, error }) => ({
  border: '1px solid ' + (error ? theme.palette.error.main : grey[300]),
  borderRadius: 6,
  height: 266,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'light' ? 'none' : theme.palette.background.default,
}));

export type CustomDropzoneInputProps = {
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  value?: File[];
  onError: (error: any) => void;
  noDuplicateFiles?: boolean;
  type: 'image' | 'csv' | 'json' | 'pdf';
  inputLabel?: string;
  error: string;
  shouldReset?: boolean;
  helperText?: string;
} & DropzoneOptions;

const DropzoneInput = ({
  onChange,
  onBlur,
  value,
  onError,
  type,
  inputLabel,
  error,
  shouldReset,
  helperText,
  noDuplicateFiles = true,
  ...rest
}: CustomDropzoneInputProps) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [initialFiles, setInitialFiles] = useState<File[]>([]);
  const [initialize, setInitialize] = useState<boolean>(false);

  const theme = useTheme();

  // load file from form initial values
  useEffect(() => {
    if (!value) return;
    setFiles(value);
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setInitialize(true);

      if (!initialize) {
        setInitialFiles(files);
      }
      const allFiles = [...files, ...acceptedFiles];

      if (rest.maxFiles && rest.maxFiles === 1) {
        if (acceptedFiles.length > 0) {
          const lastFiles = acceptedFiles[acceptedFiles.length - 1];
          onChange([lastFiles]);
        }
      } else {
        // remove duplicated files
        const uniqFiles = noDuplicateFiles ? uniqBy(allFiles, 'name') : allFiles;

        onChange(uniqFiles);
      }

      // error handling
      if (fileRejections.length) {
        // eslint-disable-next-line prefer-destructuring
        const errors = fileRejections[0].errors;

        if (errors.length) {
          const defaultError = errors[0];
          let errorMessage = '';

          switch (defaultError?.code) {
            case 'too-many-files':
              errorMessage = rest.maxFiles
                ? t('form.error.maxFilesAllowed', {
                    count: rest.maxFiles,
                    file: rest.maxFiles > 1 ? t('files') : t('file'),
                  })
                : t('form.error.tooManyFiles');
              break;
            case 'file-invalid-type':
              errorMessage = t('form.error.thisFileTypeNotAllowed');
              break;
            case 'file-too-large':
              {
                // get the max size from the error message
                const messagesArr = defaultError.message.split(' ');
                const maxSize = messagesArr.find((text: string) => Number(text));
                errorMessage = t('form.error.fileSizeLessThan', {
                  size: convertFileSizeToBytes(maxSize ? +maxSize : 0, 'mb'),
                });
              }

              break;
            default:
              errorMessage = t('errors.errorOccurred');
          }

          if (errorMessage) {
            onError(errorMessage as string);
          }
        }
      }
    },
    [onChange, files, onError, noDuplicateFiles, rest.maxFiles, initialize, t],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    ...rest,
  });

  const removeFile = (file: File) => {
    // copy inital files for reset
    setInitialize(true);
    if (!initialize) {
      setInitialFiles(files);
    }

    const remainingFiles: File[] = files.filter((currentFile: File) => currentFile.name !== file.name);

    onChange(remainingFiles);
  };

  const removeAll = () => {
    // copy inital files for reset
    setInitialize(true);
    if (!initialize) {
      setInitialFiles(files);
    }

    // remove all files
    onChange([]);
  };

  // initialize files
  const onReset = () => {
    onChange(initialFiles);
    onError('');
  };

  return (
    <div>
      <StyledDropzone {...getRootProps()} className="flexColumn" error={isDragReject || !!error}>
        <input {...getInputProps({ onChange, onBlur })} />
        {isDragActive ? (
          <Typography>{t('dropFileHere')} ...</Typography>
        ) : (
          // input labels
          <Stack direction="column" spacing={2} alignItems="center">
            <FaFileUpload size={32} color={grey[600]} />
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography>{inputLabel}</Typography>
              <Typography variant="body2" sx={{ color: error ? theme.palette.error.main : grey[600] }}>
                {t('orDragAnDropFile')}
              </Typography>
            </Box>
          </Stack>
        )}
      </StyledDropzone>
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
      {error && <FormHelperText error>{error}</FormHelperText>}

      {/* ----- image previews ----- */}
      {type === 'image' && files.length > 0 && (
        <ImagesPreview files={files} onRemoveAll={removeAll} onRemoveFile={removeFile} />
      )}

      {type !== 'image' && files.length > 0 && (
        <FilesPreview files={files} onRemoveAll={removeAll} onRemoveFile={removeFile} />
      )}

      {shouldReset && (
        <InputActionButton
          onClick={onReset}
          color={theme.palette.primary.main}
          text={t('reset')}
          icon={<FiRefreshCcw size={18} />}
        />
      )}
    </div>
  );
};

export default DropzoneInput;
