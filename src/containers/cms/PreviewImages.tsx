import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layouts/Layout";
import { IFileCloud } from "@/types/file.type";
import { PAGE_IMAGES_FIELDS, PAGE_SINGLE_IMAGE_FIELDS } from "@/validations/file.validation";

type Props<T extends Record<string, any>> = {
  page: T;
};

const PreviewImages = <T extends Record<string, any>>({ page }: Props<T>) => {
  const { t } = useTranslation();

  return (
    <Layout cardTitle={t('common:images')}>
      <Stack spacing={2}>
        {PAGE_SINGLE_IMAGE_FIELDS.map((field: string, index: number) => (
          <div key={field + index}>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>{t('cms:' + field)}</Typography>
              {page[field] ? (
                <Box sx={{ width: 300 }}>
                  <img alt={field} src={page[field].url} css={{ width: '100%' }} />
                </Box>
              ) : (
                <Typography>{t('common:errors.noField', { field: t('common:' + field) })}</Typography>
              )}
            </Box>
          </div>
        ))}

        <Stack>
          {PAGE_IMAGES_FIELDS.map((field: string, index: number) => (
            <Stack key={field + index}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>{t('common:otherImages')}</Typography>
              {page[field]?.length > 0 ? (
                <Stack direction="row" spacing={2}>
                  {page[field].map((image: IFileCloud, index: number) => (
                    <Box key={image.url + index}>
                      <Box sx={{ width: 300 }}>
                        <img alt={image.url} src={image.url} css={{ width: '100%' }} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography>{t('common:errors.noOtherImages')}</Typography>
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default PreviewImages;