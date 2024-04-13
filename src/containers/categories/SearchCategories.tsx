import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchInput from '@/components/form/inputs/SearchInput';

import EstimateAdvancedFilterForm from '@/containers/estimates/EstimateAdvancedFilterForm';
import { IRenderSearchProps } from '@/types/app.type';

const SearchCategories = ({ onSearch, onAdvancedSearch }: IRenderSearchProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Stack direction="row" spacing={2}>
        <SearchInput
          onChange={onSearch}
          name="text"
          placeholder={t('cms:category.searchCategory')}
        />
      </Stack>
      <EstimateAdvancedFilterForm onSubmit={onAdvancedSearch} />
    </>
  );
}

export default SearchCategories;
