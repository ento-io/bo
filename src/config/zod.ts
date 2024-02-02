import * as z from 'zod';

import i18n from './i18n';

export const errorMap: z.ZodErrorMap = (error, ctx) => {
  /*
  This is where you override the various error codes
  */
  switch (error.code) {
    case z.ZodIssueCode.invalid_type:
      if (error.expected === 'string') {
        return { message: i18n.t('form.error.invalidStringType') };
      }
      if (error.expected === 'number') {
        return { message: i18n.t('form.error.invalidNumberType') };
      }
      if (error.expected === 'boolean') {
        return { message: i18n.t('form.error.invalidBooleanType') };
      }
      break;
    case z.ZodIssueCode.custom: {
      // produce a custom message using error.params
      // error.params won't be set unless you passed
      // a `params` arguments into a custom validator
      const params = error.params ?? {};
      if (params.myField) {
        return { message: `Bad input: ${params.myField}` };
      }
      break;
    }
    default:
      break;
  }

  // fall back to default message!
  return { message: ctx.defaultError };
};

type MappedZodLiterals<T extends readonly z.Primitive[]> = {
  -readonly [K in keyof T]: z.ZodLiteral<T[K]>;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createManyUnion = <A extends Readonly<[z.Primitive, z.Primitive, ...z.Primitive[]]>>(literals: A) => {
  return z.union(literals.map(value => z.literal(value)) as MappedZodLiterals<A>);
};
