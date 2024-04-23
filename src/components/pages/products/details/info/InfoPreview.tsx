'use client';

import { useTranslate } from '@app/hooks';
import { IProductItem } from '@app/types';

const InfoPreview = ({ product }: { product: IProductItem }) => {
  const t = useTranslate('COMP_PRODUCT_DETAILS.PRODUCT_INFO');
  return (
    <div className="table-responsive">
      <table className="table mb-0">
        <tbody>
          <tr>
            <th scope="row" style={{ width: '200px' }}>
              {t('MASS_UNIT')}
            </th>
            <td>{product.weightUnit || t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('WEIGHT')}</th>
            <td>{product.weight?.toLocaleString('en-US') || t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('PACKAGE_TYPE')}</th>
            <td>{product.packageType || t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('MEASUREMENT_UNIT')}</th>
            <td>{product.measureUnit || t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('HEIGHT')}</th>
            <td>{product.height || t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('WIDTH')}</th>
            <td>{product.width || t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('LENGTH')}</th>
            <td>{product.length || t('N/A')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default InfoPreview;
