import { ChangeEvent, MouseEvent, ReactNode, useCallback, useEffect, useState } from 'react';

import { Checkbox, FormControlLabel, IconButton, Stack, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AiOutlineSwap } from 'react-icons/ai';

import SelectInput from '@/components/form/inputs/SelectInput';
import { StyledCheckbox, StyledCheckedCheckbox } from '@/components/form/inputs/styled/StyeldCheckbox';

import { useBreakpoint } from '@/hooks/useBreakpoint';

import { orderSelectOptions } from '@/utils/app.utils';
import { TOOLBAR_SMALL_SCREEN_HEIGHT } from '@/utils/constants';

import { ISelectOption } from '@/types/app.type';

/**
 * we get the options based on the column field (key)
 * @param headCells
 * @param updatedAtLabel
 * @returns
 */
const getOrderByOptions = (headCells: Record<string, any>[], updatedAtLabel: string): ISelectOption[] => {
  // check if there is updateAt column to the list
  const withUpdatedAtCell = headCells.find((headCell: Record<string, any>) => headCell.id === 'updatedAt');
  // remove actions column to the option (because it not a data)
  const cellsWithoutActions = headCells.filter((headCell: Record<string, any>) => headCell.id !== 'actions');

  // get all options with updatedAt
  if (withUpdatedAtCell) {
    return cellsWithoutActions.map((headCell: Record<string, any>) => ({ value: headCell.id, label: headCell.label }));
  }

  // add updated at to the options if there is no updatedAt column in the list
  const cells = cellsWithoutActions.map((headCell: Record<string, any>) => ({
    value: headCell.id,
    label: headCell.label,
  }));
  cells.unshift({ value: 'updatedAt', label: updatedAtLabel });
  return cells;
};

const selectStyles = {
  control: {
    padding: 0,
  },
};
interface Props {
  numSelected: number;
  onRequestSort: (event: MouseEvent<unknown> | null, property: any) => void;
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  orderBy?: string;
  rowCount: number;
  headCells: any;
  canMultipleSelect?: boolean;
  onOrder: (order: 'asc' | 'desc') => void;
  order: 'asc' | 'desc';
  viewsComponent: ReactNode;
}

const ListCardViewFilters = ({
  onSelectAllClick,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  headCells,
  onOrder,
  order,
  viewsComponent,
  canMultipleSelect,
}: Props) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState<boolean>(false);

  const toggle = useCallback(() => setOpen(!open), [open]);

  const isTabletDown = useBreakpoint();

  useEffect(() => {
    if (isTabletDown) return;
    // open by default in desktop
    setOpen(true);
  }, [isTabletDown, toggle]);

  const handleSortBy = (property: any) => {
    onRequestSort(null, property);
  };

  const handleSort = (value: any) => {
    onOrder(value);
  };

  return (
    <>
      {isTabletDown && (
        <Tooltip title={t('sort')}>
          <IconButton
            sx={{
              position: 'absolute',
              right: 0,
              transform: 'rotate(90deg)',
              top: { xs: TOOLBAR_SMALL_SCREEN_HEIGHT, sm: TOOLBAR_SMALL_SCREEN_HEIGHT + 6 },
            }}
            onClick={toggle}>
            <AiOutlineSwap />
          </IconButton>
        </Tooltip>
      )}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
        <Stack
          direction="row"
          alignItems="center"
          alignSelf="stretch"
          sx={{ order: { xs: 1, md: 0 }, pl: { xs: 0.5, sm: 0 } }}>
          {canMultipleSelect && (
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all data',
                  }}
                  checkedIcon={<StyledCheckedCheckbox size={18} />}
                  icon={<StyledCheckbox size={18} />}
                />
              }
              label={t('selectAll')}
            />
          )}
        </Stack>
        {open && (
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="flex-end" spacing={{ xs: 1, xl: 3 }}>
            <SelectInput
              value={orderBy}
              options={getOrderByOptions(headCells, t('updatedAt'))}
              onChange={handleSortBy}
              isMulti={false}
              width={250}
              direction="row"
              label={t('orderBy') + ' : '}
              styles={selectStyles}
              isSearchable={false}
            />
            <SelectInput
              value={order}
              options={orderSelectOptions}
              onChange={handleSort}
              isMulti={false}
              width={160}
              direction="row"
              label={t('orderSort') + ' : '}
              styles={selectStyles}
              isSearchable={false}
            />
            {viewsComponent}
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default ListCardViewFilters;
