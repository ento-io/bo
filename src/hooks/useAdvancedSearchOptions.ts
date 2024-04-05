import { ChangeEvent, useEffect, useState } from 'react';
import { IAdvancedSearchOption } from '@/types/app.type';

type Output = {
  options: IAdvancedSearchOption[];
  handleChangeOptions: (name: string) => (event: ChangeEvent<HTMLInputElement>) => void;
};
export const useAdvancedSearchOptions = (defaultOptions: IAdvancedSearchOption[] = []): Output => {
  const [options, setOptions] = useState<IAdvancedSearchOption[]>([]);

  useEffect(() => {
    setOptions(defaultOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
