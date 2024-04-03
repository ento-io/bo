import i18n from "@/config/i18n";

export const invoiceStatus = [
  {
    value: 'WAITING',
    label: i18n.t('common.waiting'),
  },
  {
    value: 'SENT',
    label: i18n.t('common.sent'),
  },
];

export const getInvoiceStatusLabel = (status: string): string => {
  const statusObj = invoiceStatus.find((s) => s.value === status);
  return statusObj?.value || status;
}