import { ReactNode, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { getEstimateCountSelector, getEstimateFiltersSelector, getEstimateEstimatesSelector } from '@/redux/reducers/estimate.reducer';
import { createEstimate, deleteEstimate, editEstimate, goToEstimate, loadEstimates, toggleEstimatesByIds } from '@/redux/actions/estimate.action';
import List from '@/components/table/List';
import { displayDate } from '@/utils/date.utils';
import { getRoleCurrentUserRolesSelector } from '@/redux/reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import i18n from '@/config/i18n';
import { IQueriesInput, TableHeadCell } from '@/types/app.type';
import ButtonActions from '@/components/ButtonActions';
import Head from '@/components/Head';
import SearchInput from '@/components/form/inputs/SearchInput';
import { estimatesRoute } from '@/routes/protected/estimate.routes';
import Dialog from '@/components/Dialog';
import UserCell from '@/components/UserCell';
import { EstimateInput, IEstimate } from '@/types/estimate.types';
import EstimateForm from './EstimateForm';
import EstimateAdvancedFilterForm from '@/containers/estimates/EstimateAdvancedFilterForm';
import AddFab from '@/components/AddFab';
import { useToggle } from '@/hooks/useToggle';

const ESTIMATE_FORM_ID = 'send-email-form-id'

interface Data {
  reference: string;
  url: string;
  createdBy: string;
  updatedBy: string;
  createdAt: ReactNode;
  actions: ReactNode;
}

const headCells: TableHeadCell<keyof Data>[] = [
  {
    id: 'reference',
    numeric: false,
    disablePadding: false,
    label: i18n.t('common:estimates.reference'),
  },
  {
    id: 'url',
    numeric: false,
    disablePadding: false,
    label: i18n.t('common:link'),
  },
  {
    id: 'createdBy',
    numeric: false,
    disablePadding: false,
    label: i18n.t('user:createdBy'),
  },
  {
    id: 'updatedBy',
    numeric: false,
    disablePadding: false,
    label: i18n.t('user:updatedBy'),
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: i18n.t('common:createdAt'),
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
];

const Estimates = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const estimates = useSelector(getEstimateEstimatesSelector);
  const count = useSelector(getEstimateCountSelector);
  const filters = useSelector(getEstimateFiltersSelector);
  const searchParams = estimatesRoute.useSearch()

  const roles = useSelector(getRoleCurrentUserRolesSelector);
  const canCreate = canAccessTo(roles, 'Contact', 'create');

  const [selectedEstimate, setSelectedEstimate] = useState<IEstimate | null>(null);
  const { open: isOpenCreation, toggle: toggleOpenCreation } = useToggle();

  const { t } = useTranslation();

  // delete a row
  const onDelete = useCallback(
    (estimate: IEstimate): void => {
      dispatch(deleteEstimate(estimate.objectId));
    },
    [dispatch],
  );

  // go to preview page
  const onPreview = useCallback(
    (id: string): void => {
      navigate(goToEstimate(id));
    },
    [navigate],
  );

  const onEdit = useCallback(
    (estimate: IEstimate): void => {
      setSelectedEstimate(estimate);
      toggleOpenCreation();
    },
    [toggleOpenCreation],
  );

  // delete selected rows
  const handleDeleteSelected = async (ids: string[]): Promise<void | undefined> => {
    dispatch(toggleEstimatesByIds(ids, 'deleted', false));
  };

  const handleCloseDialog = () => {
    setSelectedEstimate(null);
    toggleOpenCreation();
  };

  const handleFormSubmit = (values: EstimateInput) => {
    if (selectedEstimate) {
      dispatch(editEstimate(selectedEstimate.objectId, values));
      handleCloseDialog();
      return;
    }

    dispatch(createEstimate(values));
    handleCloseDialog();
  };

  const onUpdateData = (queries: IQueriesInput) => {
    const newQueries = { ...queries, filters: { ...filters, ...queries.filters } };
    dispatch(loadEstimates(newQueries))
  }

  // table data
  const dataTable = useMemo((): Data[] => {
    const canDelete = canAccessTo(roles, 'Estimate', 'delete');
    const canPreview = canAccessTo(roles, 'Estimate', 'get');
    const canEdit = canAccessTo(roles, 'Estimate', 'edit');

    const estimatesData = estimates.map((estimate: IEstimate) => {
      // default data
      const data: Record<string, any> = {
        reference: estimate.reference,
        url: estimate.url,
        createdBy: <UserCell user={estimate.createdBy} />,
        updatedBy: estimate.updatedBy ? <UserCell user={estimate.updatedBy} /> : '-',
        createdAt: displayDate(estimate.createdAt, false, true),
        actions:(
          <ButtonActions
            onDelete={canDelete ? () => onDelete(estimate) : undefined}
            onPreview={canPreview ? () => onPreview(estimate.objectId) : undefined}
            onEdit={canEdit ? () => onEdit(estimate) : undefined}
            value={estimate.reference}
          />
        )
      };

      return data as Data;
    });

    return estimatesData;
  }, [estimates, onDelete, onPreview, roles, onEdit]);

  return (
    <>
      <Head title="Estimates" />
      <List
        // @see estimates.routes.tsx for search params definition
        defaultFilters={searchParams}
        onUpdateData={onUpdateData}
        items={dataTable}
        onDeleteSelected={handleDeleteSelected}
        headCells={headCells}
        count={count}
        canDelete={canAccessTo(roles, 'Estimate', 'delete')}
        canUpdate={canAccessTo(roles, 'Estimate', 'update')}
        renderFilter={(
          onSearch: (search: string) => void,
          onAdvancedSearch: (values: Record<string, any>) => void
        ) => (
          <>
            <SearchInput onChange={onSearch} placeholder={t('user:searchByNameOrEmail')} />
            <EstimateAdvancedFilterForm onSubmit={onAdvancedSearch} />
          </>
        )}
      />

      {canCreate && (
        <AddFab
          onClick={() => {
            setSelectedEstimate(null);
            toggleOpenCreation();
          }}
        />
      )}

      <Dialog
        title={selectedEstimate ? t('common:estimates.editEstimate', { value: selectedEstimate.reference }) : t('common:estimates.createEstimate')}
        open={!!selectedEstimate || isOpenCreation}
        toggle={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        formId={ESTIMATE_FORM_ID}
      >
        <EstimateForm
          formId={ESTIMATE_FORM_ID}
          onSubmit={handleFormSubmit}
          estimate={selectedEstimate}
        />
      </Dialog>
    </>
  );
}

export default Estimates;
