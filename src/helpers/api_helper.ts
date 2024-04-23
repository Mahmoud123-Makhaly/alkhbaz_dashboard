import axios from 'axios';
import appConfig from './config';

const FakeClient = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

// intercepting to capture errors
FakeClient.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = 'Internal Server Error';
        break;
      case 401:
        message = 'Invalid credentials';
        break;
      case 404:
        message = 'Sorry! the data you are looking for could not be found';
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  },
);
const setAuthorization = token => {
  //FakeClient.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};
class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return FakeClient.get(url, params);
  // };
  get = (url, params?) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : '';
      response = FakeClient.get(`${url}?${queryString}`, params);
    } else {
      response = FakeClient.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data?) => {
    return FakeClient.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url, data?) => {
    return FakeClient.patch(url, data);
  };

  put = (url, data?) => {
    return FakeClient.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config?) => {
    return FakeClient.delete(url, { ...config });
  };
}
const getLoggedinUser = () => {
  const user = {
    status: 'success',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTliZWZjOWUzZGJjNWJhOWE0NzA4NyIsImlhdCI6MTY5MTY2NDUxNywiZXhwIjoxNjk5NDQwNTE3fQ.U5wX0k0yE98vCvem5I9dnPDvUzn5qO5R_X-Q4B3UlTU',
    data: {
      _id: '63e9befc9e3dbc5ba9a47087',
      first_name: 'polara 111',
      last_name: 'Mohammadi',
      email: 'admin@al-khbaz.com',
      phone: 93353299096,
      image: '',
      password: '$2a$12$OdX.AB8Oiz6PEXohnREMjOtIy8h4/Ha3wPMHVcA/J373tQ0afoco2',
      role: '0',
      confirm_password: '123456789',
      changePasswordAt: '2023-02-13T04:32:11.228Z',
      skills: ['Photoshop', 'illustrator', 'HTML', 'CSS', 'Javascript', 'Php', 'Python'],
      exp_year: ['2018-01-01T00:00:00.000Z', '2023-01-01T00:00:00.000Z'],
      __v: 0,
      city: 'California',
      company_name: 'al-khbaz',
      country: 'use',
      designation: 'Lead Designer / Developer',
      job_title: 'Developer',
      joining_date: '2023-01-01T00:00:00.000Z',
      website: 'www.al-khbaz.com',
      zipcode: '90011',
      description: 'tehran',
      job_description:
        "You always want to make sure that your fonts work well together and try to limit the number of fonts you use to three or less. Experiment and play around with the fonts that you already have in the software you're working with reputable font websites. ",
      portfolio: [
        {
          logo: 'github',
          bg_color: 'dark',
          link: '@daveadame',
          _id: '63eb4c2f356e48830e807dba',
        },
        {
          logo: 'global',
          bg_color: 'primary',
          link: 'www.al-khbaz.com',
          _id: '63eb4c2f356e48830e807dbb',
        },
        {
          logo: 'dribbble',
          bg_color: 'success',
          link: '@dave_adame',
          _id: '63eb4c2f356e48830e807dbc',
        },
        {
          logo: 'pinterest',
          bg_color: 'danger',
          link: 'Advance Dave',
          _id: '63eb4c2f356e48830e807dbd',
        },
      ],
      passwordtoken: 'e0804e9f2cf07ecd50aacd68d08d0655ce359a5a1f5250847e556a523f4ff104',
      passwordtokenexp: '2023-07-31T05:40:47.025Z',
    },
  };
  if (!user) {
    return null;
  } else {
    return user;
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
