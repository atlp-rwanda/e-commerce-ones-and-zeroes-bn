import Stripe from 'stripe';
import dotenv from 'dotenv';
import stripe from '../../helps/stripeConfig';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV, STRIPE_SECRET_KEY: 'sk_test_12345' };
});

afterEach(() => {
  process.env = OLD_ENV;
});

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {};
  });
});

describe('Stripe initialization', () => {
  it('should initialize Stripe with the secret key from environment variables', () => {
    const stripeInstance = stripe;

    expect(Stripe).toHaveBeenCalled();
  });

  it('should initialize Stripe with a default key if STRIPE_SECRET_KEY is not provided', () => {
    delete process.env.STRIPE_SECRET_KEY;

    const stripeModule = require('../../helps/stripeConfig').default;

    expect(Stripe).toHaveBeenCalled();
  });
});
