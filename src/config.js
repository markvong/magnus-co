const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || "{clientId}";
const ISSUER = process.env.REACT_APP_ISSUER;
const REDIRECT_URI = `${window.location.origin}/login/callback`;
const BASE_URL = process.env.REACT_APP_BASE_URL;
const LOGO_URI = "/images/mountain-solid.svg";
const TITLE = "Welcome! Please Sign In";
const USERNAME_ERR_MESSAGE = "Please provide a valid username.";
const PASSWORD_ERR_MESSAGE = "Please enter a valid password.";
const SIGN_IN_ERR = "Sign in failed! Try again.";

export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    baseUrl: BASE_URL,
    redirectUri: REDIRECT_URI,
    scopes: [
      "openid",
      "email",
      "okta.users.read",
      "okta.users.manage",
      "okta.users.manage.self",
      "okta.groups.read"
    ]
  },
  screen: {
    logo: LOGO_URI,
    title: TITLE,
    username_err_msge: USERNAME_ERR_MESSAGE,
    pw_err_msge: PASSWORD_ERR_MESSAGE,
    sign_in_err: SIGN_IN_ERR
  }
};
