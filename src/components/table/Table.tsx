import { ChangeEvent, MouseEvent, ReactNode } from 'react';

import Checkbox from '@mui/material/Checkbox';
import MUITable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import EmptyTableRow from '@/components/table/EmptyTableRow';

import { PAGINATION } from '@/utils/constants';

import { IPagination } from '@/types/app.type';

import TableHead from './TableHead';

type Props = {
  items: Record<string, any>[];
  headCells: any[];
  count: number;
  disabledRowId?: string;
  border?: boolean;
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
  loading: boolean;
};

const Table = ({
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
  isItemSelected,
  onChangePage,
  onChangeRowsPerPage,
  border = false,
  loading = false,
}: Props) => {
  const renderTableRowCell = ({ cellIndex, labelId, data, key }: any): ReactNode => {
    const firstRowAlign = headCells[cellIndex]?.align ?? 'left';

    if (cellIndex === 0) {
      return (
        <TableCell component="th" id={labelId} scope="row" align={firstRowAlign} key={cellIndex + key}>
          {(data as any)[key as string]}
        </TableCell>
      );
    }

    const align = headCells[cellIndex]?.align ?? 'right';

    return (
      <TableCell align={align} key={cellIndex + key}>
        {(data as any)[key as string]}
      </TableCell>
    );
  };

  return (
    <>
      <TableContainer sx={border ? { border: '2px solid #F5F5F5' } : null}>
        <MUITable aria-labelledby="tableTitle">
          <TableHead
            numSelected={selectedIds.length}
            order={pagination.order}
            orderBy={pagination.orderBy}
            onSelectAllClick={onSelectAll}
            onRequestSort={onSort}
            rowCount={disabledRowId ? items.length - 1 : items.length}
            headCells={headCells}
            canMultipleSelect={canMultipleSelect}
          />
          <TableBody>
            {items.length > 0 ? (
              items.map((data: Record<string, any>, index: number): ReactNode => {
                const isSelected = isItemSelected(data.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={() => onRowClick(data)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={index}
                    selected={isSelected}
                    sx={{ cursor: 'pointer' }}>
                    {/* checkbox column */}
                    {canMultipleSelect && (
                      <TableCell padding="checkbox" onClick={stopCheckboxPropagation(data)}>
                        <Checkbox
                          color="primary"
                          checked={isSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                          // onCh
                          onChange={() => onCheckedRow(data.id)}
                        />
                      </TableCell>
                    )}
                    {Object.keys(data)
                      .filter((key: string) => key !== 'id') // do not display the id in the table row
                      .map((key: string, cellIndex: number) => renderTableRowCell({ cellIndex, labelId, data, key }))}
                  </TableRow>
                );
              })
            ) : (
              // center the cell with the cell (column) number (with the checkbox column)
              <EmptyTableRow columnCount={headCells.length + 1} loading={loading} />
            )}
          </TableBody>
        </MUITable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={PAGINATION.rowsPerPageOptions}
        component="div"
        count={count}
        rowsPerPage={(pagination as any).rowsPerPage}
        page={pagination.currentPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </>
  );
};

export default Table;
