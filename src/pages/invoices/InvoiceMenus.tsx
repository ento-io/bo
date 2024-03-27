import { useTranslation } from 'react-i18next';
import { ImDownload3 } from "react-icons/im";
import { MouseEvent } from 'react';
import ActionsMenu, { ActionsMenuProps } from "@/components/ActionsMenu";

type Props = {
  onDownloadPDF: () => void;
} & ActionsMenuProps
const InvoiceMenus = ({ onDownloadPDF, ...props }: Props) => {
  const { t } = useTranslation();

  const handleDownload = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onDownloadPDF();
  };

  return (
    <ActionsMenu
      { ...props }
      menus={[
        {
          onClick: handleDownload,
          display: true,
          label: t('download'),
          icon: <ImDownload3 size={20} />
        },
      ]}
    />
  )
}

export default InvoiceMenus;