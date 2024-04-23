'use client';

import ContentPlaceholderFolderBasicForm from './ContentPlaceholderFolderBasicForm';

export interface IContentPlaceholderFormProps {
  mode: 'edit' | 'new';
  type: 'folder' | 'placeholder';
  id?: string;
  header: string;
  onCancel: () => void;
  onSubmit: () => void;
}
const BasicForm = (props: IContentPlaceholderFormProps) => {
  const { type } = props;
  switch (type) {
    case 'placeholder':
      return <h1>Hi from placholder form</h1>;
    case 'folder':
      return <ContentPlaceholderFolderBasicForm {...props} />;
    default:
      return <h1>Hi from placholder</h1>;
  }
};
export default BasicForm;
