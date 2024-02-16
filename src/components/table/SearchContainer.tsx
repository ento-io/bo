import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Box, IconButton, Stack, SxProps, Theme } from '@mui/material';
import { FiSearch } from 'react-icons/fi';

import { useBreakpoint } from '@/hooks/useBreakpoint';

import { TOOLBAR_SMALL_SCREEN_HEIGHT } from '@/utils/constants';

type Props = {
  children?: ReactNode; // if in recycleBin page
  sx?: SxProps<Theme>;
};

const SearchContainer = ({ children, sx }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const toggle = useCallback(() => setOpen(!open), [open]);

  const isSmDown = useBreakpoint();

  useEffect(() => {
    if (isSmDown) return;
    // open by default in desktop
    setOpen(true);
  }, [isSmDown, toggle]);

  return (
    <>
      {isSmDown && (
        <IconButton
          sx={{
            position: 'absolute',
            right: 40,
            top: { xs: TOOLBAR_SMALL_SCREEN_HEIGHT, sm: TOOLBAR_SMALL_SCREEN_HEIGHT + 6 },
          }}
          onClick={toggle}>
          <FiSearch />
        </IconButton>
      )}
      {open && (
        <Box sx={{ my: { xs: 1, lg: 4 }, ...sx }}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', lg: 'center' }}
            spacing={{ xs: 1, lg: 0 }}>
            {children}
          </Stack>
        </Box>
      )}
    </>
  );
};

export default SearchContainer;
