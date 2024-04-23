'use client';

import FileBasicForm from './FileBasicForm';
import FolderBasicForm from './FolderBasicForm';

export interface IAssetFormProps {
  mode: 'edit' | 'new';
  type: 'folder' | 'file';
  url: string;
  header: string;
  onCancel: () => void;
  onSubmit: () => void;
}
const BasicForm = (props: IAssetFormProps) => {
  const { type } = props;
  switch (type) {
    case 'file':
      return <FileBasicForm {...props} />;
    case 'folder':
      return <FolderBasicForm {...props} />;
    default:
      return <FolderBasicForm {...props} />;
  }
};
export default BasicForm;
