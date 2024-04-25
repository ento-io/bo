import { useMemo, useState } from "react";
import { Lang } from "@/types/setting.type";
import { DEFAULT_LANGUAGE } from "@/utils/constants";
import { IPage, IPageBlock } from "@/types/page.type";
import { getFields } from "./useTranslatedValuesByTab";
import { TRANSLATED_CMS_FIELDS } from "@/utils/cms.utils";

type Output = {
  translatedFields: Record<string, any>;
  onTabChange: (value: Lang) => void;
  tab: Lang;
  translatedBlockFields: Record<string, any>[];
}

/**
 * this will return the translated values depending on the selected language (via tabs)
 * ex: { "en": { "title": "" }, "fr": { "title": "Bjr 01" }}
 * if fr is selected, it will return { "title": "Bjr 01" }
 * else it will return { "title": "Bjr 01 (not translated)" }
 * @param translated ex: { title: { translated: { fr: "Bjr 01", en: "" }}
 * @param keys 
 * @returns 
 */
export const usePageTranslatedValuesByTab = (page: IPage): Output => {
  const [tab, setTab] = useState<Lang>(DEFAULT_LANGUAGE);

  const onTabChange = (value: Lang) => setTab(value);

  // translated blocks
  const newBlocks = useMemo(() => {
    if (!page?.blocks) return [];
    return page.blocks.map((block: IPageBlock) => {
      const values = {
        ...getFields(block.translated, ['title', 'description', 'content'], tab),
        ...block, // non translated fields
      };

      const newValues: Partial<IPageBlock> = { ...values }
      delete newValues.translated

      return newValues
    })
  }, [page, tab])
  

  return {
    translatedFields: page ? getFields(page.translated, TRANSLATED_CMS_FIELDS, tab): {},
    translatedBlockFields: newBlocks,
    onTabChange,
    tab,
  }
}

type BlockOutput = {
  translatedBlockFields: Record<string, any>[],
  onTabChange: (value: Lang) => void,
  tab: Lang,
} & Omit<Output, 'translatedFields'>;

export const useTranslatedArrayValuesByTab = <T extends Record<string, any>>(blocks: T[] = [], keys: string[] = []): BlockOutput => {
  const [tab, setTab] = useState<Lang>(DEFAULT_LANGUAGE);

  const onTabChange = (value: Lang) => setTab(value);

  const newBlocks = useMemo(() => {
    return blocks?.map(block => {
      const values = {
        ...getFields(block.translated, keys, tab),
        ...block, // non translated fields
      };
      delete values.translated

      return values
    })
  }, [blocks, tab, keys])

  return {
    translatedBlockFields: newBlocks,
    onTabChange,
    tab,
  }
}
