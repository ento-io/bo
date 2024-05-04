import { Stack, Theme, Typography } from "@mui/material";
import { ReactNode } from "react";
import Logo from "@/components/Logo";

const PADDING = '50px 82px';

const classes = {
  root: (theme: Theme) => ({
    minHeight: '100vh',
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column' as const,
    },
    [theme.breakpoints.down('md')]: {
      padding: 16,
    },
  }),
  title: (theme: Theme) => ({
    lineHeight: 1,
    fontWeight: 600,
    [theme.breakpoints.between('md', 'lg')]: {
      textAlign: 'center' as const,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: 32,
    }
  }),
  logo: (theme: Theme) => ({
    marginBottom: 160,
    [theme.breakpoints.down('lg')]: {
      marginBottom: 12,
    },
  }),
  left: (theme: Theme) => ({
    [theme.breakpoints.up('lg')]: {
      flex: 2,
      padding: PADDING,
      backgroundColor: theme.palette.grey[100],
    },
    [theme.breakpoints.down('lg')]: {
      paddingTop: 20,
      paddingBottom: 20,
    },
  }),
  leftContent: (theme: Theme) => ({
    maxWidth: 700,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  }),
  leftText: (theme: Theme) => ({
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  }),
  right: (theme: Theme) => ({
    [theme.breakpoints.up('lg')]: {
      padding: PADDING,
    },
  }),
  rightContent: (theme: Theme) => ({
    width: 360,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 60,
      paddingRight: 60,
    },
    [theme.breakpoints.between('md', 'lg')]: {
      paddingLeft: 10,
      paddingRight: 10,
    }
  })
}

type Props = {
  title: string;
  description: string;
  children: ReactNode;
  formTitle?: string;
  formDescription?: string;
  rightHeader?: ReactNode;
}

const AuthPageLayout = ({ title, description, children, formTitle, formDescription, rightHeader }: Props) => {
  return (
    <div css={classes.root} className="flexRow">
      {/* left */}
      <div css={classes.left} className="flexColumn stretchSelf">
        <div css={classes.leftContent}>
          <div css={classes.logo}>
            <Logo width={150} />
          </div>
          <Stack spacing={2} css={classes.leftText}>
            <Typography variant="h2" css={classes.title}>
              {title}
            </Typography>
            <Typography>
              {description}
            </Typography>
          </Stack>
        </div>
      </div>
      {/* right */}
      <div className="flexColumn center stretchSelf spaceBetween" css={classes.right}>
        <div>{rightHeader}</div>
        <div css={classes.rightContent}>
          <Stack spacing={2}>
            <Typography variant="h4" css={{ fontSize: 31 }}>
              {formTitle}
            </Typography>
            {formDescription && (
              <Typography>
                {formDescription}
              </Typography>
            )}
          </Stack>
          <div css={{ marginTop: 32 }}>
            {children}
          </div>
        </div>
        <div />
      </div>
    </div>
  );
}

export default AuthPageLayout;