import {environment} from '../../environments/environment';

export const CONFIG = {
  SYSTEM_CODE: 'BGW',
  KEY: {
    TOKEN: `${environment.appVersion}-${environment.USERDATA_KEY}`,
    LOCALIZATION: 'language'
  },
  API_PATH: {
    FUNCTION_CATEGORIES: '/function-categories',
    FUNCTION_CATEGORIES_LIST: '/function-categories/list',
    FUNCTION_CATEGORIES_DELETE: '/function-categories/delete'
  },
  PAGINATION: {
    CURRENT_PAGE_DEFAULT: 1,
    PAGE_LIMIT_DEFAULT: 10
  },

  STATUS: {
   ACTIVE: 1,
   INACTIVE: 0
  },

  LIST_STATUS: [
    {
      CODE: -1,
      NAME: 'ALL',
    },
    {
      CODE: 1,
      NAME: 'ACTIVE',
    },
    {
      CODE: 0,
      NAME: 'INACTIVE',
    },
  ],
  FORMAT_DATE: {
    NORMAL: 'dd-MM-yyy'
  }
};
