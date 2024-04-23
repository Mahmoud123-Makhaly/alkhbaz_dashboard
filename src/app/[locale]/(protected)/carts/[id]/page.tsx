import { CartDetails } from '@components/pages';

const Details = ({ params }: { params: { id: string } }) => {
  return <CartDetails id={params.id} />;
};
export default Details;
