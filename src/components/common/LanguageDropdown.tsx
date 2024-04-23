'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { get } from 'lodash';

import languages from '@helpers/languages';
import emptyImg from '@assets/img/chat-bg-pattern.png';
import { usePathname, useRouter } from 'next-intl/client';
import { useLocale } from 'next-intl';
import { Utils } from '@helpers/utils';

const LanguageDropdown = props => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  // Declare a new state variable, which we'll call "menu"
  const [selectedLang, setSelectedLang] = useState('');
  const languagesList = Utils.withoutProperty(languages, 'default');

  useEffect(() => {
    setSelectedLang(locale);
  }, []);

  const changeLanguageAction = lang => {
    if (lang != locale) {
      setSelectedLang(lang);
      //change here
      router.push(`/${lang}${pathname}`);
    }
  };

  const [isLanguageDropdown, setIsLanguageDropdown] = useState(false);
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdown(!isLanguageDropdown);
  };

  return (
    <Dropdown
      isOpen={isLanguageDropdown}
      toggle={toggleLanguageDropdown}
      className="ms-1 topbar-head-dropdown header-item"
    >
      <DropdownToggle className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" tag="button">
        <Image
          src={get(languagesList, `${selectedLang}.flag`) || emptyImg.src}
          alt="Header Language"
          height="20"
          width="20"
          className="rounded"
        />
      </DropdownToggle>
      <DropdownMenu className="notify-item language py-2">
        {Object.keys(languagesList).map(key => (
          <DropdownItem
            key={key}
            onClick={() => changeLanguageAction(key)}
            className={`notify-item ${selectedLang === key ? 'active' : 'none'}`}
          >
            <Image
              src={get(languagesList, `${key}.flag`) || emptyImg.src}
              width="20"
              alt="Skote"
              className="me-2 rounded"
              height="18"
            />
            <span className="align-middle">{get(languagesList, `${key}.label`)}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageDropdown;
