import { BadgeProps, PaletteColorOptions, PaletteMode, PaletteOptions, Theme, createTheme } from '@mui/material';
import { grey, teal } from '@mui/material/colors';
import { IThemeColors } from '@/types/setting.type';
import { LAYOUT_CONTENT_PADDING, RESPONSIVE_BREAKPOINT } from './constants';

export const DASHBOARD_BACKGROUND_COLOR = '#FAFBFB';
export const DEFAULT_THEME_COLOR = 'green';

export const getLinkStyles = (theme: Theme) => ({
  fontSize: 16,
  fontWeight: '500 !important',
  textDecoration: 'none',
  color: theme.palette.primary.main,
  '&:hover': {
    textDecoration: 'underline',
  },
});

export const themeColorOptions: IThemeColors[] = [
  {
    name: DEFAULT_THEME_COLOR,
    colors: {
      light: teal[50],
      main: '#03C9D7',
      dark: teal[900],
      contrastText: '#fff',
    },
  },
  {
    name: 'blue',
    colors: {
      light: '#aadbff',
      main: '#1A9BFC',
      dark: '#0a446d',
      contrastText: '#fff',
    },
  },
  {
    name: 'purple',
    colors: {
      light: '#bcadff',
      main: '#7352ff',
      dark: '#342772',
      contrastText: '#fff',
    },
  },
  {
    name: 'red',
    colors: {
      light: '#ffc6d7',
      main: '#ff5c8e',
      dark: '#72293f',
      contrastText: '#fff',
    },
  },
  {
    name: 'indigo',
    colors: {
      light: '#798cb5',
      main: '#1e4db7',
      dark: '#0e2963',
      contrastText: '#fff',
    },
  },
  {
    name: 'orange',
    colors: {
      light: '#ffdfd6',
      main: '#fb9678',
      dark: '#7c4c3e',
      contrastText: '#fff',
    },
  },
  {
    name: 'yellow',
    colors: {
      light: '#ffff91',
      main: '#a8aa00',
      dark: '#565600',
      contrastText: '#fff',
    },
  },
];

const getThemeColor = (color: string): PaletteColorOptions => {
  const selectColor = themeColorOptions.find((themeColor: IThemeColors): boolean => themeColor.name === color);

  if (!selectColor) {
    return themeColorOptions[0].colors;
  }
  return selectColor.colors;
};

const textDarkColor = {
  color: '#fff',
};

const defaultTheme = {
  palette: {
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    success: {
      main: '#00C292',
    },
    info: {
      main: '#0BB2FB',
    },
    error: {
      main: '#E46A76',
    },
  },
  typography: {
    fontFamily: [
      'DM Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          padding: '0px 3px',
          fontWeight: 500,
          fontSize: 12,
        },
        filled: {
          borderRadius: 6,
          color: '#fff',
        },
        label: {
          paddingLeft: 8,
          paddingRight: 8,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: ({ theme, ownerState }: { theme: Theme, ownerState: BadgeProps }) => {
          if (ownerState.overlap === 'rectangular') {
            return {
              color: '#fff',
              top: -2,
              left: 0,
              border: `1px solid ${theme.palette.background.paper}`,
            }
          }
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: 16,
          textTransform: 'initial',
          padding: '12px 24px',
          borderRadius: 60,
          border: 'none',
          '&.Mui-disabled': {
            color: '#fff',
            backgroundColor: theme.palette.grey[300],
          },
        }),
        contained: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
        }),
        outlined: ({ theme }: { theme: Theme }) => ({
          color: theme.palette.grey[600],
          boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)',
          ':hover': {
            border: 'none',
          },
        }),
      },
    },
    MuiLink: {
      styleOverrides:  {
        root: ({ theme }: { theme: Theme }) => getLinkStyles(theme),
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
      // mui stack has no, so overrides in the variants instead
      // ISSUE: https://stackoverflow.com/questions/72382224/styleoverrides-not-being-applied-with-styled-components-in-mui
      variants: [
        {
          props: {},
          style: {
            flexWrap: 'wrap',
          },
        },
      ],
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          paddingTop: LAYOUT_CONTENT_PADDING,
          paddingBottom: LAYOUT_CONTENT_PADDING,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          [theme.breakpoints.up('sm')]: {
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px'
          },
          [theme.breakpoints.down('sm')]: {
            boxShadow: 'none'
          }
        })
      }
    }
  },
};

export const websitePalette = {
  primary: {
    light: teal[50],
    main: '#03C9D7',
    dark: teal[900],
    contrastText: '#fff',
  },
  secondary: {
    light: '#ff7961',
    main: '#222222',
    dark: '#ba000d',
    contrastText: '#000',
  },
  success: {
    main: '#00C292',
  },
  info: {
    main: '#0BB2FB',
  },
  error: {
    main: '#E46A76',
  },
};

export const boPalette: PaletteOptions = {
  primary: {
    light: teal[50],
    main: '#03C9D7',
    dark: teal[900],
    contrastText: '#fff',
  },
  ...defaultTheme.palette,
};

const lightTheme = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    background: {
      default: '#FAFBFB',
    },
  },
  components: {
    ...defaultTheme.components,
    MuiListSubheader: {
      styleOverrides: {
        root: { color: grey[700] },
      },
    },
  },
};

const DEFAULT_BG = '#20232A';
const darkTheme = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    background: {
      paper: '#282C34',
      default: DEFAULT_BG,
    },
  },
  components: {
    ...defaultTheme.components,
    MuiTypography: {
      styleOverrides: {
        root: textDarkColor,
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: textDarkColor,
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: textDarkColor,
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: { backgroundColor: 'transparent !important' },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          backgroundColor: DEFAULT_BG,
        },
        inputMultiline: {
          backgroundColor: DEFAULT_BG,
        },
        root: {
          backgroundColor: DEFAULT_BG,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: { color: '#fff !important' },
      },
    },
  },
};

export const getTheme = (mode: PaletteMode = 'light', color = DEFAULT_THEME_COLOR): Theme => {
  const defaultTheme = mode === 'light' ? lightTheme : darkTheme;

  // @ts-expect-error - unknown type
  const theme = createTheme({
    ...defaultTheme,
    palette: {
      mode,
      primary: getThemeColor(color),
      ...defaultTheme.palette,
    },
  });

  theme.typography.h6 = {
    [theme.breakpoints.down(RESPONSIVE_BREAKPOINT)]: {
      fontSize: 14,
    },
  };

  return theme;
};
