'use client';
import { useEffect, useState } from 'react';

const CKEditor = (props: any) => {
  const [CKEditor, setCKEditor] = useState<any>();
  const [build, setBuild] = useState<any>();
  const hasType = typeof props?.type !== 'undefined';

  useEffect(() => {
    import('@ckeditor/ckeditor5-build-classic').then(mod => {
      setBuild(() => mod.default);
      import('@ckeditor/ckeditor5-react').then(mod => {
        setCKEditor(() => mod.CKEditor);
      });
    });
  }, []);

  return hasType && CKEditor && <CKEditor editor={build} {...props} />;
};
export default CKEditor;
