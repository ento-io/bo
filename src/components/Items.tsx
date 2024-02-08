import { Box, List, ListItem, ListItemIcon } from '@mui/material';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';

import { ReactNode } from 'react';
import { isStringOrNumber } from '@/utils/utils';

import { ISelectOption } from '@/types/app.type';

type Props = {
  items: ISelectOption<string | ReactNode  | undefined>[];
  alignment?: 'row' | 'column';
};

const Items = ({ items, alignment = 'row' }: Props) => {
  return (
    <List sx={{ p: 0 }}>
      {items.map((item: ISelectOption<string | ReactNode  | undefined>, index: number) => (
        <ListItem key={index} sx={{ px: 0 }}>
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <Box
            display="flex"
            flex={1}
            flexDirection={alignment}
            justifyContent="space-between"
            sx={{ alignItems: alignment === 'row' ? 'center' : 'flex-start' }}>
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
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default Items;
