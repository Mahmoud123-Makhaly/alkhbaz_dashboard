'use client';

import { Dictionary } from '@components/pages';

const Page = () => {
  return (
    <Dictionary
      ingredientPropertyId={process.env.NEXT_PUBLIC_INGREDIENT_PROPERTY_ID || ''}
      orderSourcePropertyId={process.env.NEXT_PUBLIC_ORDER_SOURCE_PROPERTY_ID || ''}
    />
  );
};
export default Page;
