'use client';

import { ProductDetails } from '@components/pages';

const Details = ({
  params,
  searchParams,
}: {
  params: { locale: string; id: string };
  searchParams: { catalogId: string };
}) => {
  return <ProductDetails id={params.id} catalogId={searchParams.catalogId} />;
};
export default Details;
