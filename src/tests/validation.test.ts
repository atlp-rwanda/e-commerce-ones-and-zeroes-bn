import { validations } from '../validations/validations';

const Joi = require('joi');

describe('validations', () => {
  describe('validateUpdatePassword', () => {
    let req: any, res: any, next: any;

    beforeEach(() => {
      req = {
        body: {
          password: 'oldPassword',
          newPassword: 'NewPassword1!',
          verifyNewPassword: 'NewPassword1!',
        },
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    test('should call next if validation passes', () => {
      validations.validateUpdatePassword(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('should return validation error if newPassword does not meet criteria', () => {
      req.body.newPassword = 'weakpassword'; // newPassword does not meet criteria
      validations.validateUpdatePassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'validation error',
        error:
          'Minimum password length is 6, with at least one number, one uppercase letter, and one special character',
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return validation error if verifyNewPassword does not match newPassword', () => {
      req.body.verifyNewPassword = 'DifferentPassword!'; // verifyNewPassword does not match newPassword
      validations.validateUpdatePassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'validation error',
        error: '"verifyNewPassword" must be [ref:newPassword]',
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return validation error if any required field is missing', () => {
      delete req.body.password; // missing required field: password
      validations.validateUpdatePassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'validation error',
        error: '"password" is required',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
