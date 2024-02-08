import { Helmet } from 'react-helmet-async';

import { formatPageTitle } from '@/utils/utils';

type Props = {
  title?: string;
  description?: string;
};

const Head = ({ title, description }: Props) => {
  const formattedTitle = formatPageTitle(title as string);

  return (
    <Helmet>
      <title>{formattedTitle}</title>
      <meta property="description" content={description} />
    </Helmet>
  );
};

export default Head;
