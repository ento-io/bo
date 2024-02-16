import { useTranslation } from 'react-i18next';

import { ReactNode } from 'react';
import BooleanIcons from '@/components/BooleanIcons';
import Items from '@/components/Items';

import { ISelectOption } from '@/types/app.type';

type Props = {
  entity: Record<string, any>;
  items?: ISelectOption<string | ReactNode>[];
};

const ItemsStatus = ({ entity, items = [] }: Props) => {
  const { t } = useTranslation();

  const statusItems: ISelectOption<ReactNode>[] = [
    {
      label: t('seen'),
      value: <BooleanIcons value={entity.seen} />,
    },
    {
      label: t('deleted'),
      value: <BooleanIcons value={entity.deleted} />,
    },
  ];

  return <Items items={[...statusItems, ...items]} />;
};

export default ItemsStatus;
