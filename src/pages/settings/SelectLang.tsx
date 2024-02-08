import { useDispatch, useSelector } from 'react-redux';

import SelectInput from '@/components/form/inputs/SelectInput';

import { locales } from '@/config/i18n';

import { changeLang } from '@/redux/actions/app.action';
import { getSettingsLangSelector } from '@/redux/reducers/settings.reducer';

import { renderLanguageLabel } from '@/utils/settings.utils';

import { Lang } from '@/types/setting.type';

const classes = {
  selectLang: {
    paddingTop: 0,
    paddingBottom: 3,
  },
};
const SelectLang = () => {
  const dispatch = useDispatch();
  const storedLang = useSelector(getSettingsLangSelector);

  const handleChangeLang = (lang: any) => {
    dispatch(changeLang(lang as Lang));
  };

  const options = locales.map((lang: any) => ({ value: lang, label: renderLanguageLabel(lang) }));

  return (
    <SelectInput
      options={options}
      value={storedLang}
      onChange={handleChangeLang}
      styles={{ control: classes.selectLang }}
    />
  );
};

export default SelectLang;
