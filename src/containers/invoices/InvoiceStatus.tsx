import { Chip } from "@mui/material";
import { IInvoice, InvoiceStatusEnum } from "@/types/invoice.type";
import { getInvoiceStatusLabel } from "@/utils/invoice.utils";

type Props = {
  status: IInvoice['status'];
}

const InvoiceStatus = ({ status }: Props) => {
  return (
    <Chip
      label={getInvoiceStatusLabel(status)}
      color={status === InvoiceStatusEnum.WAITING ? 'error': 'success'}
    />
  );
}

export default InvoiceStatus;