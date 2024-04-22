import { ReactNode } from 'react';

import { Box, Stack, SxProps, Theme, Typography } from '@mui/material';

const classes = {
  layoutContent: (isCard: boolean) => (theme: Theme) => {
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
  title: (theme: Theme) => ({
    [theme.breakpoints.up('xl')]: {
      fontSize: 32,
    },
    [theme.breakpoints.down('xl')]: {
      fontSize: 22,
      margin: 0,
    },
  }),
}

type Props = {
  children: ReactNode;
  title?: string | ReactNode;
  cardTitle?: string;
  isCard?: boolean;
  sx?: SxProps<Theme>;
  actions?: ReactNode;
  actionsEmplacement?: 'head' | 'content';
  description?: string | ReactNode;
  cardDescription?: string;
};

const Layout = ({
  title,
  children,
  cardTitle,
  sx,
  actions,
  description,
  cardDescription,
  isCard = true,
  actionsEmplacement = 'head',
}: Props) => {
  return (
    <Box sx={sx} width="100%">
      {title && (
        <Box py={{ xs: 2, lg: 2 }} display="flex" justifyContent="space-between">
          <Stack spacing={0} justifyContent="center">
            <Typography css={classes.title} variant="h2" gutterBottom>
              {title}
            </Typography>
            {description && (
              <Typography variant="h6" gutterBottom>
                {description}
              </Typography>
            )}
          </Stack>
          {actions && actionsEmplacement === 'head' && <Box className="flexRow">{actions}</Box>}
        </Box>
      )}
      <div css={classes.layoutContent(isCard)}>
        <Box display="flex" justifyContent="space-between">
          {(cardTitle || cardDescription) && (
            <Stack>
              {cardTitle && (
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {cardTitle}
                </Typography>
              )}
              {cardDescription && (
                <Typography css={{ fontSize: 12 }}>
                  {cardDescription}
                </Typography>
              )}
            </Stack>
          )}

          {isCard && actionsEmplacement === 'content' && actions && <Box className="flexRow">{actions}</Box>}
        </Box>
        {children}
      </div>
    </Box>
  );
};

export default Layout;
