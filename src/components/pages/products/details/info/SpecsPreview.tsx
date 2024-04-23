'use client';

import React from 'react';
import { useLocale } from 'next-intl';

import { useTranslate } from '@app/hooks';
import { IProductItem } from '@app/types';

const SpecsPreview = ({ product }: { product: IProductItem }) => {
  const t = useTranslate('COMP_PRODUCT_DETAILS.PRODUCT_INFO');
  const locale = useLocale() === 'en' ? 'en-US' : 'ar-EG';

  const enoughForProp = product.properties?.find(dp => dp.name === 'enoughFor');
  const ingredientsProp = product.properties?.find(dp => dp.name === 'ingredients');
  const numberOfPiecesProp = product.properties?.find(dp => dp.name === 'numberOfPieces');
  const sizeProp = product.properties?.find(dp => dp.name === 'size');

  return (
    <div className="table-responsive">
      <table className="table mb-0">
        <tbody>
          <tr>
            <th scope="row" style={{ width: '200px' }}>
              {t('SIZE')}
            </th>
            <td>{sizeProp?.values && sizeProp.values.length > 0 ? sizeProp.values[0].value : t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('NUMBER_OF_PIECES')}</th>
            <td>
              {numberOfPiecesProp?.values && numberOfPiecesProp.values.length > 0
                ? numberOfPiecesProp.values[0].value
                : t('N/A')}
            </td>
          </tr>
          <tr>
            <th scope="row">{t('ENOUGH_FOR')}</th>
            <td>
              {enoughForProp?.values && enoughForProp.values.length > 0 ? enoughForProp.values[0].value : t('N/A')}
            </td>
          </tr>
          <tr>
            <th scope="row">{t('INGREDIENTS')}</th>
            <td>
              {ingredientsProp?.values && ingredientsProp.values.length > 0
                ? ingredientsProp.values.map((ingredient, indx) => (
                    <React.Fragment key={`customer-account-role-${indx}`}>
                      {(ingredient.languageCode === locale || !ingredient.languageCode) && (
                        <div className="badge fw-medium badge-soft-info me-1">{ingredient.value}</div>
                      )}
                    </React.Fragment>
                  ))
                : t('N/A')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default SpecsPreview;
