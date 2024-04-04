import { Chip } from "@mui/material";
import { IInvoice, InvoiceStatusEnum } from "@/types/invoice.type";
import { getInvoiceStatusLabel } from "@/utils/invoice.utils";

const getColor = (status: IInvoice['status']) => {
  switch (status) {
    case InvoiceStatusEnum.WAITING:
      return 'error';
    case InvoiceStatusEnum.IN_PROGRESS:
      return 'warning';
    case InvoiceStatusEnum.SENT:
      return 'info';
    case InvoiceStatusEnum.PAID:
      return 'success';
    default:
      return 'default';
  }
}

type Props = {
  status: IInvoice['status'];
}

const InvoiceStatus = ({ status }: Props) => {
  return (
    <Chip
      label={getInvoiceStatusLabel(status)}
      color={getColor(status)}
    />
  );
}

export default InvoiceStatus;