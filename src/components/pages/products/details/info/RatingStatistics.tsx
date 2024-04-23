import { Row } from 'reactstrap';
import { useTranslate } from '@app/hooks';
import _ from 'lodash';

const RatingStatistics = ({ rates, range = 5 }: { rates: Array<number>; range?: number }) => {
  const t = useTranslate('COMP_PRODUCT_DETAILS.PRODUCT_INFO');
  const ratesAverage = rates.reduce((a, b) => a + b, 0) / rates.length;
  const totalRates = rates.reduce((partialSum, a) => partialSum + a, 0);
  const groupedRates = _.groupBy(rates, Math.floor);

  return (
    <div>
      <div className="pb-3">
        <div className="bg-light px-3 py-2 rounded-2 mb-2">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <div className="fs-16 align-middle text-warning">
                {Array.from({ length: range }).map((x, indx) => {
                  if (ratesAverage - (indx + 1) > -1)
                    return (
                      <i
                        key={'rate-statistics-' + indx}
                        className={`ri-star-${indx + 1 > ratesAverage && ratesAverage * 10 >= 1 ? 'half-' : ''}fill`}
                      ></i>
                    );
                  else return <i key={'rate-statistics-' + indx} className="ri-star-line"></i>;
                })}
              </div>
            </div>
            <div className="flex-shrink-0">
              <h6 className="mb-0">
                {rates && rates.length > 0 ? `${Math.floor(ratesAverage * 100) / 100} ${t('OUT_OF')} ${range}` : '0'}
              </h6>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-muted">
            {t('TOTAL')} <span className="fw-medium">{totalRates}</span> {t('REVIEWS')}
          </div>
        </div>
      </div>

      <div className="mt-3">
        {Array.from({ length: range }).map((x, indx) => {
          const rateExists = Object.keys(groupedRates).find(x => x == (range - indx).toString());
          const ratePercentage = rateExists ? (groupedRates[range - indx].length / rates.length) * 100 : 0;
          return (
            <Row key={'rate-statistics-' + indx} className="align-items-center g-2">
              <div className="col-auto">
                <div className="p-2">
                  <h6 className="mb-0">
                    {range - indx} {t('STAR')}
                  </h6>
                </div>
              </div>
              <div className="col">
                <div className="p-2">
                  <div className="progress animated-progess progress-sm">
                    <div
                      className={`progress-bar bg-${
                        ratePercentage <= 10 ? 'danger' : ratePercentage <= 50 ? 'warning' : 'success'
                      }`}
                      role="progressbar"
                      style={{
                        width: `${ratePercentage}%`,
                      }}
                      aria-valuenow={ratePercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <div className="p-2">
                  <h6 className="mb-0 text-muted">{rateExists ? groupedRates[range - indx].length : 0}</h6>
                </div>
              </div>
            </Row>
          );
        })}
      </div>
    </div>
  );
};
export default RatingStatistics;
