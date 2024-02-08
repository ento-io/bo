import { useState } from 'react';

import { Box, Card, CardActions, CardMedia, IconButton, Stack, styled, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FiTrash2 } from 'react-icons/fi';

import Dialog from '@/components/Dialog';

import InputActionButton from './InputActionButton';

const StyledImagePreview = styled('img')({
  width: '100%',
});

const sx = {
  cardActions: {
    position: 'absolute',
    right: 2,
    bottom: 2,
  },
  deleteButton: {
    bgcolor: '#fff',
    '&:hover': {
      bgcolor: '#fff',
      opacity: 0.8,
    },
  },
};

type Props = {
  files: File[];
  onRemoveFile: (file: File) => void;
  onRemoveAll: () => void;
};

const ImagesPreview = ({ files, onRemoveFile, onRemoveAll }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleRemoveFile = (file: File) => (event: any) => {
    event.stopPropagation();
    onRemoveFile(file);
  };

  const onSelectImage = (file: File) => setSelectedImage(file);
  const clearSelectImage = () => setSelectedImage(null);

  return (
    <Box sx={{ pt: 2 }}>
      <Stack direction="row" spacing={3}>
        {/* ----- file previews ----- */}
        {Array.isArray(files) &&
          files.map((file, index) => (
            <Card
              sx={{
                maxWidth: 200,
                position: 'relative',
                p: 1,
                cursor: 'pointer',
                border: '1px solid ' + ((file as any).path ? 'transparent' : theme.palette.info.main),
              }}
              key={index}
              elevation={1}
              onClick={() => onSelectImage(file)}>
              {/* ----- image ----- */}
              <CardMedia component="img" sx={{ minHeight: 200 }} image={URL.createObjectURL(file)} title={file.name} />
              <span>{(file as any).path}</span>

              {/* ----- buttons ----- */}
              <CardActions sx={sx.cardActions}>
                <IconButton aria-label="delete-image" onClick={handleRemoveFile(file)} sx={sx.deleteButton}>
                  <FiTrash2 size={22} color={theme.palette.error.main} />
                </IconButton>
              </CardActions>
            </Card>
          ))}
      </Stack>

      {/* ----- remove all button ----- */}
      {files.length > 1 && (
        <InputActionButton
          onClick={onRemoveAll}
          color={theme.palette.error.main}
          text={t('removeAll')}
          icon={<FiTrash2 size={18} />}
        />
      )}

      <Dialog
        title={selectedImage?.name as string}
        open={!!selectedImage}
        toggle={clearSelectImage}
        secondaryButtonText={t('close')}>
        {selectedImage ? (
          <StyledImagePreview alt={selectedImage?.name ?? ''} src={URL.createObjectURL(selectedImage)} />
        ) : null}
      </Dialog>
    </Box>
  );
};

export default ImagesPreview;
