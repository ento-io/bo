import { object, string, number } from 'zod';
import { errorMap } from '@/config/zod';

import { formatPhoneNumber, validatePhoneNumber } from '@/utils/user.utils';

import { capitalizeFirstLetter } from '@/utils/utils';
import i18n from '@/config/i18n';

const passwordFieldSchema = string()
  .min(8, i18n.t('form.error.min', { field: i18n.t('user:password'), number: 8 }))
  .max(64, i18n.t('form.error.max', { field: i18n.t('user:password'), number: 64 }));

const userSchema = object({
  email: string()
    .email({ message: i18n.t('form.error.required', { field: 'Email' }) })
    .max(120, i18n.t('form.error.max', { field: 'Email', number: 120 }))
    .refine(value => value.toLowerCase()),
  password: passwordFieldSchema,
});

export const loginSchema = userSchema.pick({ email: true, password: true });

export const emailSchema = loginSchema.pick({ email: true });

const passwordConfirmationSchema = string().min(
  1,
  i18n.t('form.error.required', { field: i18n.t('user:passwordConfirmation') }),
);

export const resetPasswordSchema = object({
  newPassword: passwordFieldSchema,
  newPasswordConfirmation: passwordConfirmationSchema,
})
  // compare the password and confirm password fields
  .refine(value => value.newPassword === value.newPasswordConfirmation, {
    message: i18n.t('form.error.passwordNotMatch'),
    path: ['newPasswordConfirmation'],
  });

export const signUpSchema = userSchema
  .extend({
    passwordConfirmation: passwordConfirmationSchema,
    lastName: string({ errorMap })
      .min(1, i18n.t('form.error.required', { field: i18n.t('user:lastName') }))
      .max(112, i18n.t('form.error.max', { field: i18n.t('user:lastName'), number: 112 }))
      .transform(capitalizeFirstLetter),
    firstName: string({ errorMap })
      .max(112, i18n.t('form.error.max', { field: i18n.t('user:firstName'), number: 112 }))
      .optional()
      .transform((value: any) => (value ? capitalizeFirstLetter(value) : '')),
  })
  // compare the password and confirm password fields
  .refine((value: any) => value.password === value.passwordConfirmation, {
    message: i18n.t('form.error.passwordNotMatch'),
    path: ['passwordConfirmation'],
  })
  .refine((value: any) => value.password !== value.email, {
    message: i18n.t('form.error.passwordAndEmailShouldBeDifferent'),
    path: ['password'],
  });

export const signUpInfoSchema = object({
  lastName: string({ errorMap })
    .min(1, i18n.t('form.error.required', { field: i18n.t('user:lastName') }))
    .max(112, i18n.t('form.error.max', { field: i18n.t('user:lastName'), number: 112 }))
    .refine(capitalizeFirstLetter),
  firstName: string({ errorMap })
    .max(112, i18n.t('form.error.max', { field: i18n.t('user:firstName'), number: 112 }))
    .refine(capitalizeFirstLetter),
  phone: number()
    .or(
      string()
        .min(6, i18n.t('form.error.required', { field: i18n.t('user:phoneNumber'), number: 6 }))
        .max(12, i18n.t('form.error.max', { field: i18n.t('user:phoneNumber'), number: 12 }))
        .regex(/\d+/)
        // validate phone number (by regex)
        .refine(validatePhoneNumber, {
          message: i18n.t('user.invalidPhoneNumber'),
        })
        // format the input entered by user to database format
        .transform(formatPhoneNumber)
        // convert the input string to number
        .transform(Number),
    )
    .refine(n => n >= 0),
  // sex: sexSchema,
  // birthday: date({
  //   required_error: i18n.t('form.error.required', { field: i18n.t('user:birthday') }),
  //   invalid_type_error: i18n.t('form.error.required', { field: i18n.t('common:form.invalidDateType') }),
  // }), // convert string / date type to unix timestamp
  address: string({ errorMap })
    .min(1, i18n.t('form.error.required', { field: i18n.t('common:address') }))
    .max(150, i18n.t('form.error.max', { field: i18n.t('common:address'), number: 150 }))
    .refine(capitalizeFirstLetter),
});

export const signUpUploadImageSchema = object({
  image: string({ errorMap }),
});

export const changePasswordSchema = object({
  currentPassword: passwordFieldSchema,
  newPassword: passwordFieldSchema,
  newPasswordConfirmation: passwordConfirmationSchema,
})
  // compare the password and confirm password fields
  .refine(value => value.newPassword === value.newPasswordConfirmation, {
    message: i18n.t('form.error.passwordNotMatch'),
    path: ['newPasswordConfirmation'],
  });

export const profileUserInfoSchema = signUpInfoSchema.pick({ lastName: true, firstName: true });
