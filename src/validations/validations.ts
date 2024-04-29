import Joi from "joi";

export default class validations {
    static validateUpdatePassword(req: any, res: any, next: any){
        const schema = Joi.object({
            password: Joi.string().required(),
            newPassword : Joi.string().pattern(
                new RegExp(
                  "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$"
                )
              )
              .required()
              .messages({
                "string.pattern.base":
                  "Minimum password length is 6, with at least one number, one uppercase letter, and one special character",
              }),
              verifyNewPassword: Joi.string().valid(Joi.ref("newPassword")).required()
              
        });

        const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    next();

    }
}