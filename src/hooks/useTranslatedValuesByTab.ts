import { useState } from "react";
import { Lang } from "@/types/setting.type";
import { getTranslatedField } from "@/utils/settings.utils";
import { DEFAULT_LANGUAGE } from "@/utils/constants";

type Output = {
  translatedFields: Record<string, any>,
  onTabChange: (value: Lang) => void,
  tab: Lang,
}

/**
 * input: { "en": { "title": "" }, "fr": { "title": "Bjr 01" }}
 * output: { "title": "Bjr 01" }
 * @param translated 
 * @param keys 
 * @param tab 
 * @returns 
 */
const getFields = <T extends object>(translated: T, keys: string[], tab: Output['tab']) => {
  if (!translated) return {};

  const lang = tab;
  const translatedFields = keys.reduce((acc, key) => {
    const value = getTranslatedField<T>(translated, lang, key);
    return { ...acc, [key]: value };
  }, {});

  return translatedFields;
};

/**
 * this will return the translated values depending on the selected language (via tabs)
 * ex: { "en": { "title": "" }, "fr": { "title": "Bjr 01" }}
 * if fr is selected, it will return { "title": "Bjr 01" }
 * else it will return { "title": "Bjr 01 (not translated)" }
 * @param translated ex: { title: { translated: { fr: "Bjr 01", en: "" }}
 * @param keys 
 * @returns 
 */
export const useTranslatedValuesByTab = <T extends object>(translated?: T, keys: string[] = []): Output => {
  // const language = useSelector(getSettingsLangSelector);

  const [tab, setTab] = useState<Lang>(DEFAULT_LANGUAGE);

  const onTabChange = (value: Lang) => setTab(value);

  return {
    translatedFields: translated ? getFields(translated, keys, tab) : {},
    onTabChange,
    tab,
  }
}
