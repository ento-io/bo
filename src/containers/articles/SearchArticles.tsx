import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchInput from '@/components/form/inputs/SearchInput';

import ArticleAdvancedFilterForm from '@/containers/articles/ArticleAdvancedFilterForm';
import { IRenderSearchProps } from '@/types/app.type';

const SearchArticles = ({ onSearch, onAdvancedSearch }: IRenderSearchProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Stack direction="row" spacing={2}>
        <SearchInput
          onChange={onSearch}
          name="text"
          placeholder={t('cms:searchByPage')}
        />
        <SearchInput
          onChange={onSearch}
          name="user"
          placeholder={t('cms:searchByAuthor')}
        />
      </Stack>
      <ArticleAdvancedFilterForm onSubmit={onAdvancedSearch} />
    </>
  );
}

export default SearchArticles;
