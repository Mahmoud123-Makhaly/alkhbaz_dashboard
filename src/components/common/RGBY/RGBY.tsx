import { Badge } from 'reactstrap';
import { IRGBY } from './RGBY.types';
import { Utils } from '@helpers/utils';

const RGBY = ({ preset, value }: { preset: IRGBY; value: any }) => {
  const selectedColor = Utils.findKeyByValue(preset, value);
  const getSelectedClass = () => {
    switch (selectedColor) {
      case 'red':
        return 'danger';
      case 'green':
        return 'success';
      case 'blue':
        return 'primary';
      case 'yellow':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <h4>
      <Badge color={`${getSelectedClass()} fw-medium w-xs`} pill>
        {value}
      </Badge>
    </h4>
  );
};
export default RGBY;
