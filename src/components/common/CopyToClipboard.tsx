import { useToast, useTranslate } from '@app/hooks';

export interface ICopyToClipboardProps {
  text: string;
  successMsg?: string;
  errorMsg?: string;
  bootstrapFSClass?: string;
  bootstrapButtonClassColor?: string;
}
const CopyToClipboard = ({
  text,
  successMsg,
  errorMsg,
  bootstrapFSClass,
  bootstrapButtonClassColor,
}: ICopyToClipboardProps) => {
  const t = useTranslate('COMP_CopyToClipboard');
  const toast = useToast();
  const onCopy = e => {
    navigator.clipboard.writeText(text).then(
      function () {
        toast.success(successMsg || t('COPY_SUCCESS_MSG'));
      },
      function () {
        toast.error(errorMsg || t('ERR_COPY_MSG'));
      },
    );
  };
  return (
    <button
      type="button"
      className={`btn btn-icon btn-sm ${bootstrapButtonClassColor || 'btn-ghost-success'} float-end ${
        bootstrapFSClass || 'fs-20'
      }`}
      onClick={onCopy}
    >
      <i className="ri-links-line"></i>
    </button>
  );
};
export default CopyToClipboard;
