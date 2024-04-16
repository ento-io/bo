import { useState } from "react"

import { debounce } from "lodash";
import { useSelector } from "react-redux";
import AutocompleteField, { AutocompleteProps } from "@/components/form/fields/AutocompleteField";
import { searchCategoriesForAutocomplete } from "@/redux/actions/category.action";
import { getTranslatedField } from "@/utils/settings.utils";
import { ISelectOption } from "@/types/app.type";
import { ICategory, ICategoryTypeEntity } from "@/types/category.types";
import { getSettingsLangSelector } from "@/redux/reducers/settings.reducer";

type ICategoryOptionValue = {
  objectId: string;
}
type ICategoryOption = ISelectOption<ICategoryOptionValue>;

type Props = {
  entity: ICategoryTypeEntity;
  name: string;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
} & Omit<AutocompleteProps<ICategoryOptionValue>, 'options'>

/**
 * search a category for an article for example
 * @returns 
 */
const CategoriesSearchByEntityField = ({ entity, name, label, placeholder, multiple = true, ...otherProps }: Props) => {
  const language = useSelector(getSettingsLangSelector);

  const [categoryOptions, setCategoryOptions] = useState<ICategoryOption[]>([]);
  const [categoryOptionsLoading, setCategoryOptionsLoading] = useState<boolean>(false);

  /** autocomplete search */
  const handleSearchCategory = debounce(async (search: string) => {
    setCategoryOptionsLoading(true);
    const categories = await searchCategoriesForAutocomplete(search, entity) || [];
    const newOptions = categories.map((category: ICategory) => ({
      value: {
        objectId: category.objectId,
      },
      label: getTranslatedField(category.translated, language, 'name')
    }));
    setCategoryOptions(newOptions);
    setCategoryOptionsLoading(false);
  }, 500)

  return (
    <AutocompleteField<ICategoryOptionValue>
      {...otherProps}
      name={name}
      label={label}
      placeholder={placeholder}
      disableNoOptions
      loading={categoryOptionsLoading}
      options={categoryOptions}
      fullWidth
      onSearch={handleSearchCategory}
      multiple={multiple}
    />
  )
}

export default CategoriesSearchByEntityField;