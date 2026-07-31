const NAME_REGEX = /^[A-Za-z\s'.-]{2,50}$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const ZIP_REGEX = /^[0-9]{4,6}$/;

export function validateCheckoutForm(values) {
  const errors = {};

  if (!values.fullName || !values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (!NAME_REGEX.test(values.fullName.trim())) {
    errors.fullName = 'Enter a valid name (letters only, 2-50 characters).';
  }

  if (!values.phone || !values.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_REGEX.test(values.phone.trim())) {
    errors.phone = 'Enter a valid 10-digit phone number.';
  }

  if (!values.addressLine || !values.addressLine.trim()) {
    errors.addressLine = 'Delivery address is required.';
  } else if (values.addressLine.trim().length < 5) {
    errors.addressLine = 'Address must be at least 5 characters.';
  }

  if (!values.city || !values.city.trim()) {
    errors.city = 'City is required.';
  }

  if (!values.zipCode || !values.zipCode.trim()) {
    errors.zipCode = 'ZIP / postal code is required.';
  } else if (!ZIP_REGEX.test(values.zipCode.trim())) {
    errors.zipCode = 'Enter a valid postal code (4-6 digits).';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
