import { ChangeEvent, useState } from 'react';

import { Box, Theme, styled } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';

type StyledSearchInputProps = {
  theme?: Theme;
  width: number | string;
};
const StyledSearchInput = styled(Box, { shouldForwardProp: prop => prop !== 'width' })<StyledSearchInputProps>(
  ({ theme, width }) => ({
    padding: '0.5px 4px',
    width,
    border: theme.palette.mode === 'light' ? '1px solid #BDBDBD' : 'none',
    borderRadius: 6,
    backgroundColor: theme.palette.mode === 'light' ? 'none' : theme.palette.background.default,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  }),
);

type Props = {
  onChange: (value: string) => void;
  placeholder?: string;
  withDivider?: boolean;
  width?: number | string;
};

const SearchInput = ({ onChange, placeholder, width = '18vw', withDivider = false }: Props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <StyledSearchInput className="flexRow center" width={width}>
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <FiSearch />
      </IconButton>
      {withDivider && <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />}
      <InputBase
        sx={{ ml: 0, flex: 1, fontSize: 14 }}
        placeholder={placeholder ?? t('search')}
        value={value}
        onChange={handleChange}
      />
    </StyledSearchInput>
  );
};

export default SearchInput;
