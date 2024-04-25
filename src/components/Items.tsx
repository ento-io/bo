import { Box, List, ListItem, ListItemIcon } from '@mui/material';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';

import { ReactNode } from 'react';
import { isStringOrNumber } from '@/utils/utils';

import { ISelectOption } from '@/types/app.type';

const classes = {
  content: (alignment: string, labelLength: number) => {
    const styles: Record<string, string | number> = {
      flexDirection: labelLength > 50 ? 'column' : alignment,
    };

    if (alignment === 'row') {
      if (labelLength > 50) {
        styles.alignItems = 'flex-start';
      } else {
        styles.alignItems = 'center';
      }
    } else {
      styles.alignItems = 'flex-start';
    }

    return styles;
  },
};

type Props = {
  items: ISelectOption<string | ReactNode  | undefined>[];
  alignment?: 'row' | 'column';
};

const Items = ({ items, alignment = 'row' }: Props) => {
  return (
    <List sx={{ p: 0 }}>
      {items.map((item: ISelectOption<string | ReactNode  | undefined>, index: number) => (
        item.hide ? null : (
          <ListItem key={index} sx={{ px: 0 }}>
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <div
              className="flexRow flex1 spaceBetween"
              css={classes.content(alignment, item.label.length)}
            >
              <Box flex={1} display="flex" alignItems="center">
                <Typography
                  sx={{ fontWeight: 500, color: theme => (theme.palette.mode === 'light' ? '#000' : grey[400]) }}>
                  {item.label}
                </Typography>
              </Box>
              {/* if value is a string, wrap it inside <p></p>, otherwise, no wrapper */}
              <Box
                flex={{ xs: 1, lg: 2 }}
                display="flex"
                alignItems="center"
                justifyContent={{ xs: 'flex-end', md: 'flex-start' }}>
                {isStringOrNumber(item.value) ? <Typography variant="body1">{item.value}</Typography> : item.value}
              </Box>
            </div>
          </ListItem>
        )
      ))}
    </List>
  );
};

export default Items;
