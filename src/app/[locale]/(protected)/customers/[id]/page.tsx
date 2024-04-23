'use client';

import { CustomerDetails } from '@components/pages';

const Details = ({ params }: { params: { id: string } }) => {
  return <CustomerDetails id={params.id} />;
};
export default Details;
