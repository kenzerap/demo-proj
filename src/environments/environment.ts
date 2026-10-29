export const environment = {
  production: false,
  apiBaseUrl: '{{apiBaseUrl}}',
  awsAuth: {
    Cognito: {
      userPoolClientId: '{{userPoolClientId}}',
      userPoolId: '{{userPoolId}}',
      loginWith: {
        oauth: {
          domain: '{{domain}}',
          scopes: [
            '{{scopes}}',
            'openid',
            'email',
            'profile',
          ],
          redirectSignIn: ['http://localhost:3000'],
          redirectSignOut: ['http://localhost:3000'],
          responseType: 'code' as 'code' | 'token',
        },
      },
    },
  },
};
