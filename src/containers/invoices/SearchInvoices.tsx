import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchInput from '@/components/form/inputs/SearchInput';

import { IRenderSearchProps } from '@/types/app.type';
import InvoiceAdvancedFilterForm from './InvoiceAdvancedFilterForm';

const SearchInvoices = ({ onSearch, onAdvancedSearch }: IRenderSearchProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Stack direction="row" spacing={2}>
        <SearchInput
          onChange={onSearch}
          name="text"
          placeholder={t('estimates.searchText')}
        />
        <SearchInput
          onChange={onSearch}
          name="user"
          placeholder={t('user:searchByNameOrEmail')}
        />
      </Stack>
      <InvoiceAdvancedFilterForm onSubmit={onAdvancedSearch} />
    </>
  );
}

export default SearchInvoices;
