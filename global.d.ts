import 'react';

// Use type safe message keys with `next-intl`
type Messages = typeof import('./messages/en.json');
declare interface IntlMessages extends Messages {}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.md' {
  const src: string;
  export default src;
}

// Lord Icon

type LordIconTrigger = 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'morph-two-way';

type LordIconProps = {
  src?: string;
  trigger?: LordIconTrigger;
  colors?: string;
  delay?: string | number;
};

type LordIconElement = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & LordIconProps;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': LordIconElement;
    }
  }
}
