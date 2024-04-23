import { Input } from 'reactstrap';

const SwitchButton = ({ checked, disabled }: { checked: boolean; disabled?: boolean }) => (
  <div className="form-check form-switch">
    <Input className="form-check-input" type="checkbox" role="switch" defaultChecked={checked} disabled={disabled} />
  </div>
);
export default SwitchButton;
