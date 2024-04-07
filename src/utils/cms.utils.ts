import { locales } from "@/config/i18n";
import { defaultTabOptions } from "./app.utils";
import { IArticle, IArticleInput } from "@/types/article.types";

export const articlesTabOptions = defaultTabOptions;

/**
 * in the database, these translated fields is transformed to have this schema
 * { "fr": { "title": "xxx_fr", "description": "yyyy_fr" },  "en": { "title": "xxx_en", "description": "yyyy_en" }, ... }
 */
export const TRANSLATED_CMS_FIELDS = [
  'name',
  'title',
  'description',
  'content',
  'slug',
  'metaTitle',
  'metaDescription',
  'tags',
];

/**
 * format translated form fields name to data base fields
 * ex: { "title+fr": "my-title-fr" } to { "fr": { "title" : "my-title-fr" }}
 * @param values
 * @returns
 */
export const formatTranslatedFormValuesToSave = (values: Record<string, any>): any => {
  const newValues: Record<string, any> = {};

  for (const key of Object.keys(values)) {
    const separatedKey = key.split(':');
    const keyLang = separatedKey[0]; // ex: fr
    const keyName = separatedKey[separatedKey.length - 1]; // ex: title

    if (locales.includes(keyLang)) {
      newValues[keyLang] = {
        ...newValues[keyLang],
        [keyName]: values[key],
      };
    } else {
      newValues[key] = values[key];
    }
  }

  return {
    // important: all translated fields must be in this key (ex: { translated: { fr: { title: 'xxx' }, en: { title: 'yyy' } } })
    translated: newValues,
  };
};

/**
 * parse data base fields to translated form fields name to data base field
 * ex: { "fr": { "title" : "my-title-fr" }} to { "title+fr": "my-title-fr" }
 * @param values
 * @returns
 */
export const parseSavedTranslatedValuesToForm = (
  values: Record<string, any>,
  otherFields: string[] = [],
): any => {
  const newValues: Record<string, any> = {};

  Object.keys(values).forEach(key => {
    // translated fields
    if (key === 'translated') {
      Object.keys(values[key]).forEach((subKey) => {
        const translated = key; // translated
        const locale = subKey; // fr, en, ...
        // article['translated']['fr']
        Object.keys(values[translated][locale]).forEach(field => {
          // article['fr:title'] = 'Bonjour'
          newValues[locale + ':' + field] = values[translated][locale][field];
        })
      });
      // other fields
    } else if (otherFields.includes(key)) {
      newValues[key] = values[key];
    }
  });

  return newValues;
};

export const getCmsEditionCmsInitialValues = (
  article: IArticle | null | undefined,
): IArticleInput | undefined => {
  if (!article) return;

  const valuesToEdit = parseSavedTranslatedValuesToForm(article);

  const defaultValues = {
    ...valuesToEdit,
  };

  return defaultValues;
};