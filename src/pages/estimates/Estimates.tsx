import { useTranslation } from 'react-i18next';
import Head from '@/components/Head';

const Estimates = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Head title={t('estimates')} />
      <h1>Estimates</h1>
    </div>
  );
}

export default Estimates;
