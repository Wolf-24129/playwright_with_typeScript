export const credentials = {
  validUser: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  lockedUser: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  performanceUser: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
  },
  invalidUser: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
};

export const baseURL = process.env.BASE_URL || 'https://www.saucedemo.com';
