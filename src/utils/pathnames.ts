import i18n from "@/config/i18n";

export const PATH_NAMES = {
  home: '/',
  users: '/' + i18n.t('route:users'),
  articles: '/' + i18n.t('route:articles'),
  admins: '/' + i18n.t('route:admins'),
  login: '/' + i18n.t('route:login'),
  signUp: '/' + i18n.t('route:signup'),
  changePassword: '/' + i18n.t('route:users'),
  profile: '/' + i18n.t('route:profile'),
  roles: '/' + i18n.t('route:roles'),
  settings: '/' + i18n.t('route:settings'),
  logout: '/' + i18n.t('route:logout'),
  account: {
    root: '/' + i18n.t('route:account'),
    confirmResetPasswordCode: '/' + i18n.t('route:confirmCode'),
    resetPassword: '/' + i18n.t('route:emailResetPassword'),
    verifyAccount: '/' + i18n.t('route:verifyAccount'),
  },
  create: i18n.t('route:add'),
  edit: i18n.t('route:edit'),
  estimates: i18n.t('route:estimate'),
};