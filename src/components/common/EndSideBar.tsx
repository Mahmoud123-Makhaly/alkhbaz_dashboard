import { Suspense } from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import Loader from './Loader';

interface IEndSideBarProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  toggle?: React.MouseEventHandler<any>;
  width?: string;
  loseFocusClose?: boolean;
  [k: string]: any;
}
const EndSideBar = (props: IEndSideBarProps) => {
  const { children, title, isOpen, toggle, width, loseFocusClose, ...rest } = props;
  return (
    <Offcanvas
      fade
      isOpen={isOpen}
      direction="end"
      className="offcanvas-end border-0"
      unmountOnClose={true}
      style={{ width: width || '400px' }}
      toggle={loseFocusClose ? toggle : undefined}
      {...rest}
    >
      <OffcanvasHeader
        className="d-flex align-items-center bg-primary bg-gradient p-3 offcanvas-header-dark"
        toggle={toggle}
      >
        <span className="m-0 me-2 text-white">{title}</span>
      </OffcanvasHeader>
      <OffcanvasBody className="p-0">
        <SimpleBar className="h-100">
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </SimpleBar>
      </OffcanvasBody>
    </Offcanvas>
  );
};
export default EndSideBar;
