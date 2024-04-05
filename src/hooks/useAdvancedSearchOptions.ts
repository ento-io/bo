import { useTranslation } from 'react-i18next';

import { ChangeEvent, useEffect, useState } from 'react';
import { IAdvancedSearchOption } from '@/types/app.type';

type Output = {
  options: IAdvancedSearchOption[];
  handleChangeOptions: (name: string) => (event: ChangeEvent<HTMLInputElement>) => void;
};
export const useAdvancedSearchOptions = (defaultOptions: IAdvancedSearchOption[] = []): Output => {
  const [options, setOptions] = useState<IAdvancedSearchOption[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    setOptions(defaultOptions);
  }, [t, defaultOptions]);

  const handleChangeOptions = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setOptions((prevState: IAdvancedSearchOption[]) => {
      return prevState.map((option: IAdvancedSearchOption) => {
        if (option.name === name) {
          return { ...option, checked: event.target.checked };
        }
        return option;
      });
    });
  };

  return {
    options,
    handleChangeOptions
  }
};
