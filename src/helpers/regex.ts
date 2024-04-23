const appRegx = {
  StartWithCharAllowSpace: /^[A-Za-z\u0600-\u06FF ][A-Za-z0-9\u0600-\u06FF ]*$/,
  StartWithCharAllowSpaceBackSlashForwardSlashDash: /^[A-Za-z\u0600-\u06FF ][A-Za-z0-9\u0600-\u06FF /-\\]*$/,
  LettersOrDigitals: /^[a-zA-Z0-9]+$/,
  PasswordRegExp: /(?=^.{8,}$)((?=.*[A-Z])(?=.*[a-z]))^.*/,
  NotAcceptSpacesOnlyAcceptPeriodsOrUnderscores: /^[^0-9][a-zA-Z0-9_.]*$/,
  PhoneRegExp: /^\d{10,}$/,
  ErrUserName: /^Username.*is already taken\.$/,
  ErrRoleName: /^Role name.*is already taken\.$/,
  ErrEmail: /^Email.*is already taken\.$/,
  FileName: /^(?!-)[a-z0-9-]{3,40}(?<!-)$/,
  EmailFormat: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export { appRegx };
