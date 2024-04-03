import i18n from "@/config/i18n";

export const estimateStatus = [
  {
    value: 'WAITING',
    label: i18n.t('common:status.waiting'),
  },
  {
    value: 'DONE',
    label: i18n.t('common:status.done'),
  },
];

export const getEstimateStatusLabel = (status: string): string => {
  const statusObj = estimateStatus.find((s) => s.value === status);
  return statusObj?.value || status;
}