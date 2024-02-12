import { object, string, date, literal, array, boolean, union } from 'zod';

import { errorMap } from '@/config/zod';


export const ABOUT_ME_LENGTH = 500;

const sexSchema = union([literal('male'), literal('female')]);

export const userFilterSchema = object({
  email: string().email().optional().or(literal('')),
  lastName: string({ errorMap }),
  firstName: string({ errorMap }),
  sex: array(string().optional()).optional().or(sexSchema).optional(),
  birthday: array(date().nullable()).optional(),
  platform: array(string().optional()).optional(),
  isOnline: array(boolean().optional()).optional(),
});
