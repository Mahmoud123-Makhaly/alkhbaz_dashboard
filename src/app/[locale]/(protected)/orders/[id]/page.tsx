'use client';

import { OrderDetails } from '@components/pages';

const Details = ({ params }: { params: { locale: string; id: string } }) => {
  return <OrderDetails id={params.id} />;
};
export default Details;
