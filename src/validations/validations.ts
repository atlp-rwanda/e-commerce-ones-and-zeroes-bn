
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