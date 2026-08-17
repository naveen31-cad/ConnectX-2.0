// Validates strict 12-digit numerical format for National ID
export const validateNationalID = (id) => {
  const regex = /^\d{12}$/;
  return regex.test(id);
};

// Generates a 6-digit mock OTP displayed on-screen for testing
export const generateTestOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};