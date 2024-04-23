import { Badge } from 'reactstrap';
import { IRGBYSoft } from './RGBY.types';
import { Utils } from '@helpers/utils';

const RGBYSoft = ({ preset, value }: { preset: IRGBYSoft; value: any }) => {
  const selectedColor = Utils.findKeyByValue(preset, value);
  const getBadge = () => {
    switch (selectedColor) {
      case 'warning':
        return <span className="badge text-uppercase badge-soft-warning  w-100"> {value}</span>;
      case 'danger':
        return <span className="badge text-uppercase badge-soft-danger  w-100"> {value}</span>;
      case 'secondary':
        return <span className="badge text-uppercase badge-soft-secondary  w-100"> {value}</span>;
      case 'info':
        return <span className="badge text-uppercase badge-soft-info  w-100"> {value}</span>;
      case 'primary':
        return <span className="badge text-uppercase badge-soft-primary  w-100"> {value}</span>;
      case 'success':
        return <span className="badge text-uppercase badge-soft-success  w-100"> {value}</span>;
      case 'dark':
        return <span className="badge text-uppercase badge-outline-dark bg-dark text-white  w-100"> {value}</span>;
      case 'light':
        return <span className="badge text-uppercase badge-outline-light text-dark  w-100"> {value}</span>;
      default:
        return <span className="badge text-uppercase badge-soft-primary  w-100"> {value}</span>;
    }
  };

  return getBadge();
};
export default RGBYSoft;
