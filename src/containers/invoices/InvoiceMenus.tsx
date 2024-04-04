import { useTranslation } from 'react-i18next';
import { ImDownload3 } from "react-icons/im";
import { MouseEvent } from 'react';
import { Theme } from '@mui/material';
import { FiRefreshCw } from "react-icons/fi";
import ActionsMenu, { ActionsMenuProps } from "@/components/ActionsMenu";

type Props = {
  onDownloadPDF: () => void;
  onRegeneratePDF: () => void;
} & ActionsMenuProps
const InvoiceMenus = ({ onDownloadPDF, onRegeneratePDF, ...props }: Props) => {
  const { t } = useTranslation();

  const handleDownload = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onDownloadPDF();
  };

  const handleRegenerate = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onRegeneratePDF();
  };

  return (
    <ActionsMenu
      { ...props }
      menus={[
        {
          onClick: handleDownload,
          display: true,
          label: t('download'),
          icon: <ImDownload3 size={20} css={(theme: Theme) => ({ color: theme.palette.info.main })} />
        },
        {
          onClick: handleRegenerate,
          display: true,
          label: t('regeneratePdf'),
          icon: <FiRefreshCw size={20} />
        },
      ]}
    />
  )
}

export default InvoiceMenus;