import { ChangeEvent, MouseEvent, ReactNode } from 'react';

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

import EmptyData from '@/components/EmptyData';
import { StyledCheckbox, StyledCheckedCheckbox } from '@/components/form/inputs/styled/StyeldCheckbox';

import { PAGINATION } from '@/utils/constants';
import { isString } from '@/utils/utils';

import { IPagination } from '@/types/app.type';

import ListCardViewFilters from './ListCardViewFilters';

/**
 * get all columns except id or actions
 * @param data
 * @param removeAction
 * @returns
 */
const getFilteredData = (data: Record<string, any>, removeAction = false): string[] => {
  const keys = Object.keys(data);

  if (!removeAction) {
    return keys.filter((key: string): boolean => key !== 'id');
  }

  return keys.filter((key: string): boolean => key !== 'id' && key !== 'actions');
};

/**
 * get only action column
 * @param data
 * @returns
 */
const getActionsColumn = (data: Record<string, any>) => {
  const keys = Object.keys(data);

  if (keys.at(-1) === 'actions') {
    return data.actions;
  }
};

type Props = {
  items: Record<string, any>[];
  headCells: any[];
  count: number;
  disabledRowId?: string;
  pagination: IPagination;
  selectedIds: string[];
  onSelectAll: (event: ChangeEvent<HTMLInputElement>) => void;
  onSort: (_: MouseEvent<unknown> | null, property: any) => void;
  canMultipleSelect: boolean;
  onRowClick: (data: Record<string, any>) => void;
  isItemSelected: (id: string) => boolean;
  stopCheckboxPropagation: (data: Record<string, any>) => (event: MouseEvent<HTMLElement>) => void;
  onCheckedRow: (objectId: string) => void;
  onChangePage: (_: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
  onOrder: (order: 'asc' | 'desc') => void;
  viewsComponent: ReactNode;
};

const ListCardsView = ({
  items,
  headCells,
  count,
  disabledRowId,
  selectedIds,
  pagination,
  onSelectAll,
  onSort,
  canMultipleSelect,
  onRowClick,
  stopCheckboxPropagation,
  onCheckedRow,
  onChangePage,
  onChangeRowsPerPage,
  isItemSelected,
  onOrder,
  viewsComponent,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      <Box sx={{ mb: { xs: 0, lg: 2 }, my: { xs: 2, lg: 0 } }}>
        <ListCardViewFilters
          numSelected={selectedIds.length}
          orderBy={pagination.orderBy}
          order={pagination.order}
          onSelectAllClick={onSelectAll}
          onRequestSort={onSort}
          rowCount={disabledRowId ? items.length - 1 : items.length}
          headCells={headCells}
          canMultipleSelect={canMultipleSelect}
          onOrder={onOrder}
          viewsComponent={viewsComponent}
        />
      </Box>
      <Grid container spacing={{ xs: 8, sm: 8, lg: 2 }}>
        {items.length > 0 ? (
          items.map((data: any, index: number): ReactNode => {
            const isSelected = isItemSelected(data.id);

            return (
              <Grid item xs={12} sm={12} md={8} lg={6} xl={3} key={data.id + index} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    borderRadius: { xs: 0, md: 4 },
                    cursor: 'pointer',
                    backgroundColor: isSelected ? grey[100] : 'inherit',
                  }}
                  className="alignSelf flex1"
                  elevation={isSelected ? 4 : 1}
                  onClick={() => onRowClick(data)}>
                  <CardContent sx={{ p: { xs: 0, sm: 2 } }}>
                    <Stack spacing={1}>
                      {getFilteredData(data, true).map((key: string, cellIndex: number) => (
                        <Stack key={cellIndex + (data as any)[key as string]} spacing={1}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            {/* label (left) */}
                            <Typography sx={{ color: theme => theme.palette.grey[500] }}>
                              {headCells[cellIndex].label}
                            </Typography>
                            {/* value (right) */}
                            {isString((data as any)[key as string]) ? (
                              <Typography>{(data as any)[key as string]}</Typography>
                            ) : (
                              <div>{(data as any)[key as string]}</div>
                            )}
                          </Stack>
                          <Divider />
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                  <CardActions className="flexRow spaceBetween">
                    {canMultipleSelect && (
                      // checkbox (left)
                      // need a container to stop the card click propagation
                      <Box onClick={stopCheckboxPropagation(data)}>
                        <Tooltip title={t('select')}>
                          <Checkbox
                            color="primary"
                            checked={isSelected}
                            disableRipple
                            inputProps={{
                              'aria-labelledby': 'list-card-view-' + data.id,
                            }}
                            onChange={() => onCheckedRow(data.id)}
                            checkedIcon={<StyledCheckedCheckbox size={18} />}
                            icon={<StyledCheckbox size={18} />}
                          />
                        </Tooltip>
                      </Box>
                    )}
                    {/* icon button actions (right) */}
                    {getActionsColumn(data)}
                  </CardActions>
                </Card>
              </Grid>
            );
          })
        ) : (
          // center the cell with the cell (column) number (with the checkbox column)
          // <EmptyTableRow columnCount={headCells.length + 1} loading={loading} />
          <EmptyData sx={{ mt: 5, py: 5 }} />
        )}
      </Grid>
      <TablePagination
        rowsPerPageOptions={PAGINATION.rowsPerPageOptions}
        component="div"
        count={count}
        rowsPerPage={(pagination as any).rowsPerPage}
        page={pagination.currentPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </div>
  );
};

export default ListCardsView;
