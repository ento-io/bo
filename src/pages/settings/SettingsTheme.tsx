import { ChangeEvent } from 'react';

import { Box, Button, FormControlLabel, Stack, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import InputLabel from '@/components/form/InputLabel';
import { StyledAndroidSwitch } from '@/components/form/inputs/styled/StyledAndroidSwitch';

import { changeThemeColorSlice, changeThemeSlice, getSettingsThemeSelector } from '@/redux/reducers/settings.reducer';

import { themeColorOptions } from '@/utils/theme.utils';

import { IThemeColors } from '@/types/setting.type';

const SettingsTheme = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector(getSettingsThemeSelector);

  const onChangeTheme = (event: ChangeEvent<HTMLInputElement>) => {
    const checkedTheme = event.target.checked ? 'light' : 'dark';
    dispatch(changeThemeSlice(checkedTheme));
  };

  const onChangeThemeColor = (color: string) => {
    dispatch(changeThemeColorSlice(color));
  };

  return (
    <Stack spacing={2}>
      {/* theme mode selection */}
      <Stack>
        <InputLabel label="Theme" />
        <FormControlLabel
          control={<StyledAndroidSwitch sx={{ m: 1 }} checked={theme === 'light'} onChange={onChangeTheme} />}
          label={theme === 'light' ? t('light') : t('dark')}
        />
      </Stack>
      {/* language selection */}
      <Stack>
        <InputLabel label={t('themeColors')} />
        <Stack direction="row" spacing={1}>
          {/* colors selection */}
          {themeColorOptions.map((colorOption: IThemeColors, index: number) => (
            <Button
              key={colorOption.name + index}
              onClick={() => onChangeThemeColor(colorOption.name)}
              sx={{ minWidth: 0 }}>
              <Tooltip title={t('colors.' + colorOption.name)}>
                <Box
                  sx={{
                    borderRadius: '50%',
                    bgcolor: (colorOption.colors as any).main,
                    width: { xs: 30, lg: 40 },
                    height: { xs: 30, lg: 40 },
                  }}
                />
              </Tooltip>
            </Button>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SettingsTheme;
