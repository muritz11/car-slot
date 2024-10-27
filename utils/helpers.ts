export const testStrongPassword = (password: string) => {
  const capsRegex = new RegExp(/[A-Z]/);
  const numberRegex = new RegExp(/\d/);
  const specialCharRegex = new RegExp(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/);
  if (!capsRegex.test(password)) return false;

  if (!numberRegex.test(password)) return false;

  if (!specialCharRegex.test(password)) return false;

  return true;
};

export const truncateText = (text: string, maxLength: number) => {
  if (text?.length <= maxLength) {
    return text;
  } else {
    return text?.substring(0, maxLength) + "...";
  }
};
