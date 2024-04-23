import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { APIClient, endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';

const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://');
const cookiePrefix = 'al-khbaz-dashboard';

async function refreshAccessToken(token) {
  try {
    const res = await APIClient.post(
      endpoints.auth.authorize,
      {
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${token.accessToken}` },
      },
    );

    if (res && res.status >= 200 && res.data.access_token) {
      return {
        ...token,
        accessToken: res.data.access_token,
        expiresIn: Date.now() + Number.parseInt((res.data.expires_in || '0').toString()) * 1000,
        refreshToken: res.data.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      };
    } else {
      throw res;
    }
  } catch (error) {
    console.error('RefreshAccessTokenError', error);
    return {
      error: 'RefreshAccessTokenError',
    };
  }
}

const auth: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials, req) {
        let user;
        try {
          const res = await APIClient.post(endpoints.auth.authorize, {
            grant_type: 'password',
            scope: 'offline_access',
            username: credentials?.username,
            password: credentials?.password,
          });
          if (res && res.status >= 200 && res.data.access_token) {
            const currentUserResp = await APIClient.get(endpoints.auth.securityCurrentUser, {
              headers: { Authorization: `Bearer ${res.data.access_token}` },
            });
            if (currentUserResp && currentUserResp.status >= 200 && currentUserResp.data) {
              const tokenParams = Utils.decodeJWT(res.data.access_token);
              const userRoles = tokenParams.role
                ? Array.isArray(tokenParams.role)
                  ? tokenParams.role
                  : [tokenParams.role]
                : [];
              user = {
                emailAddress: tokenParams['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
                roles: userRoles,
                oiTKNId: tokenParams.oi_tkn_id || '',
                iss: tokenParams.iss || '',
                tokenType: res.data.token_type,
                expiresIn: Date.now() + Number.parseInt((res.data.expires_in || '0').toString()) * 1000,
                accessToken: res.data.access_token,
                refreshToken: res.data.refresh_token,
                ...currentUserResp.data,
              };
            } else user = null;
          } else user = null;
        } catch (err) {
          user = null;
        } finally {
          return user;
        }
      },
    }),
  ],
  useSecureCookies,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    redirect: ({ url, baseUrl }) => {
      return baseUrl + '/dashboard';
    },
    async jwt({ token, user, account, trigger, session }) {
      // Return previous token if the access token has not expired yet
      if (
        (trigger === 'signIn' && Date.now() < Number.parseInt(user['expiresIn'].toString())) ||
        Date.now() < Number.parseInt((token['expiresIn'] || '0').toString())
      ) {
        return { ...token, ...user };
      } else return refreshAccessToken({ ...token, ...user });
    },
    async session({ session, token, user }) {
      if (!token.error) session.user = token as any;
      else {
        session.error = token.error;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: useSecureCookies
        ? `__Secure-next-auth.session-token.${cookiePrefix}`
        : `next-auth.session-token.${cookiePrefix}`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: useSecureCookies
        ? `__Secure-next-auth.callback-url.${cookiePrefix}`
        : `next-auth.callback-url.${cookiePrefix}`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: useSecureCookies ? `__Host-next-auth.csrf-token.${cookiePrefix}` : `next-auth.csrf-token.${cookiePrefix}`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier.${cookiePrefix}`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        maxAge: 900,
      },
    },
    state: {
      name: `next-auth.state.${cookiePrefix}`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        maxAge: 900,
      },
    },
    nonce: {
      name: `next-auth.nonce.${cookiePrefix}`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
  },
};

export default auth;
