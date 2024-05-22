import Joi from 'joi';
import { Request, Response } from 'express';

// VALIDATE EMAIL
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
};

// VALIDATE PASSWORD
const validatePassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

class validations {
  static validateUpdatePassword(req: any, res: any, next: any) {
    const schema = Joi.object({
      password: Joi.string().required(),
      newPassword: Joi.string()
        .pattern(
          new RegExp(
            '^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$',
          ),
        )
        .required()
        .messages({
          'string.pattern.base':
            'Minimum password length is 6, with at least one number, one uppercase letter, and one special character',
        }),
      verifyNewPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({
        status: 'fail',
        message: 'validation error',
        error: error.details[0].message,
      });
    }

    next();
  }
}
export { validations, validateEmail, validatePassword };
