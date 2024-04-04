import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from 'react';

import { IconButton, Stack, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { FiGrid, FiList } from 'react-icons/fi';
import { useSelector } from 'react-redux';

import { debounce } from 'lodash';
import { useBreakpoint } from '@/hooks/useBreakpoint';

import { getAppLoadingSelector } from '@/redux/reducers/app.reducer';

import { DEFAULT_PAGINATION, DEFAULT_QUERIES_INPUT } from '@/utils/constants';
import { pagePaginationToQueryInput } from '@/utils/utils';

import { IListTabValue, IMenu, IPagination, IQueriesInput, IRenderSearchProps } from '@/types/app.type';

import ListCardsView from './ListCardsView';
import Table from './Table';
import TableToolbar from './TableToolbar';
import SearchContainer from './SearchContainer';
import ListTabs from './ListTabs';
import { convertTabToFilters } from '@/utils/app.utils';

type Props<IQuery> = {
  tabs?: IListTabValue[];
  items: Record<string, any>[];
  headCells: any[];
  count: number;
  onDeleteSelected?: (ids: string[]) => void;
  disabledRowId?: string;
  onMarkAsSeenSelected?: (ids: string[]) => void;
  onRowClick?: (id: string) => void;
  canDelete?: boolean;
  canUpdate?: boolean;
  renderFilter: (values: IRenderSearchProps) => ReactNode;
  border?: boolean;
  onUpdateData: any;
  defaultFilters?: IQuery;
  disableRowClickEvent?: boolean;
  toolbarMenus?: IMenu<string[]>[];
};

const List = <IQuery extends IQueriesInput['filters'],>({
  tabs = [],
  items,
  headCells,
  count,
  onDeleteSelected,
  disabledRowId,
  onMarkAsSeenSelected,
  onRowClick,
  canDelete,
  canUpdate,
  onUpdateData,
  renderFilter,
  defaultFilters,
  toolbarMenus,
  disableRowClickEvent = true,
  border = false,
}: Props<IQuery>) => {
  const [initPagination, setInitPagination] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>(DEFAULT_PAGINATION);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [view, setView] = useState<'table' | 'card'>('card');
  const [queries, setQueries] = useState<IQueriesInput>(DEFAULT_QUERIES_INPUT);

  const isDesktopDown = useBreakpoint();
  const { t } = useTranslation();
  const loading = useSelector(getAppLoadingSelector);

  useEffect(() => {
    if (isDesktopDown) return;
    setView('table');
  }, [isDesktopDown]);

  useEffect(() => {
    if (!defaultFilters) return;

    setQueries((prev) => {
      const newFilters = convertTabToFilters(tabs, defaultFilters.tab, prev.filters);

      return {
        ...prev,
        filters: {
          ...prev.filters,
          ...defaultFilters,
          ...newFilters
        }
      }
    });
  }, [defaultFilters, tabs]);

  // remove the checkboxes if there is no multiple actions
  const canMultipleSelect = !!(onDeleteSelected ?? onMarkAsSeenSelected);

  useEffect(() => {
    if (initPagination) {
      setPagination(DEFAULT_PAGINATION);
      // setSelectedIds([]);
    }
  }, [initPagination]);

  const handleChangeTable = (values: IQueriesInput) => {
    const newQueries = {
      ...queries,
      ...values,
      filters: {
        ...queries.filters,
      },
    };
    setQueries(newQueries);
    onUpdateData(newQueries);
    // dispatch(loadUsers(newQueries));
    // stay in the current page
    setInitPagination(false);
  };

  const onAdvancedSearch = (values: Record<string, any>) => {
    // queries for database search
    // add the search values to the queries
    const newQueries = {
      ...queries,
      search: values,
      filters: {
        ...queries.filters,
      },
      skip: 0,
    };

    onUpdateData(newQueries);
    setQueries(newQueries);
    // stay in the current page
    setInitPagination(true);
  };

  // input search on key up
  const onSearch = debounce((name: string, value: string) => {
    const newQueries = {
      ...queries,
      search: { ...queries.search, [name]: value },
      filters: {
        ...queries.filters,
      },
      skip: 0,
    };
    setQueries(newQueries);
    onUpdateData(newQueries);
    setInitPagination(true);
  }, 500);

    /**
   * reload data for each tab change
   * it redirect to a new page with the same url but with a search params (ex: ?tab=new)
   * so the data are in onPageEnter
   * @param tabValue
   */
    const handleTabChange = (tabValue: string) => {
      // remove prev tab filters (only tab filters)
      if (queries.filters) {
        Object.keys(queries.filters).forEach((key: string) => {
          if (tabs.find((tab: IListTabValue): boolean => [tab.key, tab.tab].includes(key))) {
            delete queries.filters?.[key];
          }
        })
      }

      // change the tab name to queries
      // ex: ?tab=new to { seen: false }
      const filters = convertTabToFilters(tabs, tabValue, queries.filters);

      queries.filters = filters;
      queries.search = undefined;
  
      setQueries(queries);
      // NOTE:
      // here we do not need to update the onChange function
      // the url change will trigger the onPageEnter,
      // then there we change the url search params to filters for db queries
      // should always be in page 1 after the search
      setInitPagination(true);
    };

  const handleSort = (_: MouseEvent<unknown> | null, property: any): void => {
    const isAsc = pagination.orderBy === property && pagination.order === 'asc';
    const defaultOrder = isAsc ? 'desc' : 'asc';
    const state = { ...pagination, order: defaultOrder, orderBy: property, currentPage: 0 };
    setPagination(state as any);
    handleChangeTable(pagePaginationToQueryInput(state as any));
  };

  const handleOrder = (order: 'asc' | 'desc'): void => {
    const state = { ...pagination, order };
    setPagination(state as any);
    handleChangeTable(pagePaginationToQueryInput(state as any));
  };

  const handleChangePage = (_: unknown, newPage: number): void => {
    const skip = newPage * (pagination.rowsPerPage || 1);

    setPagination({ ...pagination, currentPage: newPage });
    handleChangeTable(pagePaginationToQueryInput({ ...pagination, currentPage: skip }));
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const limit = parseInt(event.target.value, 10);
    const state = { ...pagination, rowsPerPage: limit };
    setPagination(state);
    handleChangeTable(pagePaginationToQueryInput(state));
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void | undefined => {
    if (event.target.checked) {
      let selectedIds: string[] = items.map((item: any): string => item.id || item.objectId);

      // can not select the disabled row (id)
      if (disabledRowId) {
        selectedIds = selectedIds.filter((id: string): boolean => id !== disabledRowId);
      }

      setSelectedIds(selectedIds);
      return;
    }
    setSelectedIds([]);
  };

  const handleCheckedRow = (objectId: string): void | undefined => {
    if (objectId === disabledRowId) return; // can not be checked

    const selectedIndex = selectedIds.indexOf(objectId);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, objectId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedIds.slice(0, selectedIndex), selectedIds.slice(selectedIndex + 1));
    }

    setSelectedIds(newSelected);
    if (!onRowClick) return;
    onRowClick(objectId);
  };

  // const handleDeleteSelected = () => onDeleteSelected?.(selectedIds);
  // const handleMarkAsSeenSelected = () => onMarkAsSeenSelected?.(selectedIds);

  const isSelected = (name: string): boolean => selectedIds.indexOf(name) !== -1;

  const handleRowClick = (data: Record<string, any>) => (event: MouseEvent<HTMLElement>): void | undefined => {
    if (disableRowClickEvent) {
      event?.preventDefault();
    }

    // custom click
    if (onRowClick) {
      onRowClick(data.id);
      return;
    }

    if (disableRowClickEvent) return
    // props from Actions component
    // if enable row click, it will go to preview
    if (data.actions.props.onPreview) {
      data.actions.props.onPreview(data.id);
      return;
    }

    // checked when the row is clicked
    handleCheckedRow(data.id);
  };

  const stopCheckboxPropagation =
    (data: Record<string, any>) =>
    (event: MouseEvent<HTMLElement>): void => {
      // props from Actions component
      if (data.actions.props.onPreview) {
        event.stopPropagation();
      }
    };

  const views = (
    <Stack direction="row" justifyContent="flex-end">
      <Tooltip title={t('listViewTooltip')}>
        <IconButton color={view === 'table' ? 'primary' : 'default'} onClick={() => setView('table')}>
          <FiList />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('cardViewTooltip')}>
        <IconButton color={view === 'card' ? 'primary' : 'default'} onClick={() => setView('card')}>
          <FiGrid />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* tabs using search params */}
      {tabs.length > 0 && (
        <ListTabs
          onTabChange={handleTabChange}
          tabs={tabs}
          searchParams={{ tab: defaultFilters?.tab }}
        />
      )}

      <SearchContainer>
        {renderFilter({ onSearch, onAdvancedSearch })}
        {/* <SearchInput onChange={onSearch} placeholder={t('user:searchByNameOrEmail')} />
        <UserAdvancedFilter onSubmit={onAdvancedSearch} /> */}
      </SearchContainer>
      {/* ------- search and filter ------- */}
      <TableToolbar
        selectedIds={selectedIds}
        onDeleteSelected={canDelete && onDeleteSelected ? onDeleteSelected : undefined}
        onMarkAsSeenSelected={canUpdate && onMarkAsSeenSelected ? onMarkAsSeenSelected : undefined}
        menus={toolbarMenus}
      />
      {/* ------- view selection buttons ------- */}
      {view === 'table' && !isDesktopDown && views}
      {/* ------- list (table or card) ------- */}
      {view === 'table' ? (
        <Table
          items={items}
          headCells={headCells}
          count={count}
          disabledRowId={disabledRowId}
          selectedIds={selectedIds}
          pagination={pagination}
          onSelectAll={handleSelectAll}
          onSort={handleSort}
          canMultipleSelect={canMultipleSelect}
          onRowClick={handleRowClick}
          stopCheckboxPropagation={stopCheckboxPropagation}
          onCheckedRow={handleCheckedRow}
          isItemSelected={isSelected}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          border={border}
          loading={loading}
        />
      ) : (
        <ListCardsView
          items={items}
          headCells={headCells}
          count={count}
          disabledRowId={disabledRowId}
          selectedIds={selectedIds}
          pagination={pagination}
          onSelectAll={handleSelectAll}
          onSort={handleSort}
          canMultipleSelect={canMultipleSelect}
          onRowClick={handleRowClick}
          stopCheckboxPropagation={stopCheckboxPropagation}
          onCheckedRow={handleCheckedRow}
          isItemSelected={isSelected}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onOrder={handleOrder}
          viewsComponent={isDesktopDown ? null : views}
        />
      )}
    </Box>
  );
};

export default List;
