import { ReactNode } from 'react';

import { Box, Stack, SxProps, Theme, Typography, styled } from '@mui/material';

type StyledLayoutProps = {
  theme?: Theme;
  isCard: boolean;
};
const StyledLayout = styled(Box, { shouldForwardProp: prop => prop !== 'isCard' })<StyledLayoutProps>(
  ({ theme, isCard }) => {
    if (!isCard) return null;
    return {
      backgroundColor: theme.palette.mode === 'light' ? 'rgb(255, 255, 255)' : theme.palette.background.paper,
      color: 'rgba(0, 0, 0, 0.87)',
      transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      overflow: 'hidden',
      borderRadius: 4,
      boxShadow: theme.palette.mode === 'light' ? 'rgb(90 114 123 / 11%) 0px 7px 30px 0px' : 'none',
      padding: 24,
      [theme.breakpoints.down('sm')]: {
        padding: 0,
      },
      [theme.breakpoints.between('sm', 'md')]: {
        padding: 12,
      },
      [theme.breakpoints.between('md', 'lg')]: {
        padding: 16,
      },
      [theme.breakpoints.down('md')]: {
        borderRadius: 0,
        boxShadow: 'none',
      },
    };
  },
);

const StyledTitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up('xl')]: {
    fontSize: 32,
  },
  [theme.breakpoints.down('xl')]: {
    fontSize: 22,
    margin: 0,
  },
}));

type Props = {
  children: ReactNode;
  title?: string | ReactNode;
  cardTitle?: string;
  isCard?: boolean;
  sx?: SxProps<Theme>;
  actions?: ReactNode;
  actionsEmplacement?: 'head' | 'content';
  description?: string | ReactNode;
};

const Layout = ({
  title,
  children,
  cardTitle,
  sx,
  actions,
  description,
  isCard = true,
  actionsEmplacement = 'head',
}: Props) => {
  return (
    <Box sx={sx} px={{ xs: 1, lg: 0 }} width="100%">
      {title && (
        <Box py={{ xs: 2, lg: 2 }} display="flex" justifyContent="space-between">
          <Stack spacing={0} justifyContent="center">
            <StyledTitle variant="h2" gutterBottom>
              {title}
            </StyledTitle>
            {description && (
              <Typography variant="h6" gutterBottom>
                {description}
              </Typography>
            )}
          </Stack>
          {actions && actionsEmplacement === 'head' && <Box className="flexRow">{actions}</Box>}
        </Box>
      )}
      <StyledLayout isCard={isCard}>
        <Box display="flex" justifyContent="space-between">
          {cardTitle && (
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {cardTitle}
            </Typography>
          )}
          {isCard && actionsEmplacement === 'content' && actions && <Box className="flexRow">{actions}</Box>}
        </Box>
        {children}
      </StyledLayout>
    </Box>
  );
};

export default Layout;
