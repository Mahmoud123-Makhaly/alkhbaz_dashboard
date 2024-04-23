import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { ICart } from '@app/types';
import { useTranslate } from '@app/hooks';

const CartSummary = ({ data }: { data: ICart | undefined }) => {
  const t = useTranslate('COMP_CART.DETAILS.CART_SUMMARY');
  const withCurrency = (value?: number) => `${data?.currency || 0} ${value || 0}`;

  return (
    <div className="sticky-side-div">
      <Card>
        <CardHeader>
          <h5 className="mb-0">{t('HEADER')}</h5>
        </CardHeader>
        <CardBody>
          <div className="table-responsive">
            <table className="table table-borderless mb-0">
              <tbody>
                <tr>
                  <td>{t('SUBTOTAL')} </td>
                  <td className="text-end" id="cart-subtotal">
                    {withCurrency(data?.subTotal)}
                  </td>
                </tr>
                <tr>
                  <td>{t('DISCOUNT')} </td>
                  <td className="text-end" id="cart-discount">
                    {withCurrency(data?.discountTotal)}
                  </td>
                </tr>
                <tr>
                  <td>{t('SHIPPING_SUBTOTAL')}</td>
                  <td className="text-end" id="cart-shipping">
                    {withCurrency(data?.shippingTotal)}
                  </td>
                </tr>
                <tr>
                  <td>{t('ESTIMATED_TAX')} </td>
                  <td className="text-end" id="cart-tax">
                    {withCurrency(data?.taxTotal)}
                  </td>
                </tr>
                <tr>
                  <td>{t('TAX_TYPES')}</td>
                  <td className="text-end" id="cart-tax">
                    {data?.taxType || 0}
                  </td>
                </tr>
                <tr>
                  <td> {t('PAYMENT_SUBTOTAL')} </td>
                  <td className="text-end" id="cart-tax">
                    {withCurrency(data?.paymentSubTotal)}
                  </td>
                </tr>
                <tr>
                  <td> {t('SUBTOTAL_WITH_TAX')}</td>
                  <td className="text-end" id="cart-tax">
                    {withCurrency(data?.subTotalWithTax)}
                  </td>
                </tr>
                <tr className="table-active">
                  <th>
                    {t('TOTAL')} ({data?.currency}){' '}
                  </th>
                  <td className="text-end">
                    <span className="fw-semibold" id="cart-total">
                      {withCurrency(data?.total)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CartSummary;
