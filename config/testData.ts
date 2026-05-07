export const loginTestData = [
  {
    username: 'standard_user',
    password: 'secret_sauce',
    scenario: 'valid credentials',
    expectedSuccess: true,
  },
  {
    username: 'locked_out_user',
    password: 'secret_sauce',
    scenario: 'locked out user',
    expectedSuccess: false,
    expectedError: 'Epic sadface: Sorry, this user has been locked out.',
  },
  {
    username: 'invalid_user',
    password: 'invalid_password',
    scenario: 'invalid credentials',
    expectedSuccess: false,
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    username: '',
    password: 'secret_sauce',
    scenario: 'empty username',
    expectedSuccess: false,
    expectedError: 'Epic sadface: Username is required',
  },
  {
    username: 'standard_user',
    password: '',
    scenario: 'empty password',
    expectedSuccess: false,
    expectedError: 'Epic sadface: Password is required',
  },
  {
    username: '',
    password: '',
    scenario: 'empty credentials',
    expectedSuccess: false,
    expectedError: 'Epic sadface: Username is required',
  },
];

export const products = [
  {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: '$29.99',
  },
  {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
  },
  {
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    price: '$15.99',
  },
];
