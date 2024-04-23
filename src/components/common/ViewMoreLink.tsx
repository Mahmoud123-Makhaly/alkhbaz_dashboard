'use client';

import Link from 'next-intl/link';
import { useTranslate } from '@app/hooks';
const ViewMoreLink = ({ url }: { url: string }) => {
  const t = useTranslate('Components.ViewMoreLink');
  return (
    <Link href={`${url}`} className="btn btn-primary btn-sm">
      {t('VIEW_MORE')} <i className="ri-arrow-right-line align-middle"></i>
    </Link>
  );
};
export default ViewMoreLink;
