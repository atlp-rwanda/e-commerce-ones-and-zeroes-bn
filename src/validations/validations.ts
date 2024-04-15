// import { z } from "zod";

// const passwordStrength =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

// const validation = z
//   .object({
//     firstName: z
//       .string({ required_error: "FirstName is required" })
//       .min(5, "Use atleast 5 characters for Firstname field")
//       .max(20, "No more than 20 characters for firstname field")
//       .regex(/[A-Za-z\s]$/, "Firstname should not contain a number"),
//     lastName: z
//       .string({ required_error: "LastName is required" })
//       .min(5, "Use atleast 2 characters for Lastname field")
//       .max(20, "No more than 20 characters for Lastname field")
//       .regex(/[A-Za-z\s]$/, "Lastname should not contain a number"),
//     email: z.string().email("Email field must be a valid email"),
//     password: z
//       .string()
//       .min(8, "password should be atleast 8 characters length")
//       .regex(passwordStrength, "Password should be alphanumeric ")
//   })
//   .strict();



// export {validation };




// VALIDATE EMAIL
const validateEmail = (email: string): boolean => {
  // validate user email
  const emailRegex: RegExp =
    /^[a-zA-Z0-9_.+][a-zA-Z][a-zA-Z0-9_.+]@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g;

  const validEmail: boolean = emailRegex.test(email);

  return validEmail;
};

// VALIDATE PASSWORD
const validatePassword = (password: string): boolean => {
  let response: boolean = false;
  // validate user password
  const passwordRegex: RegExp =
    /^(?=.[A-Za-z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%*?&]{8,16}$/;

  response = passwordRegex.test(password);

  return response;
};

export { validateEmail, validatePassword };