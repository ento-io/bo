import { z } from "zod";
import { loginSchema, signUpSchema } from "../validations/auth.validations";
import { IUser } from "./user.types";

export type ISignUpInput = z.infer<typeof signUpSchema>;
export type ILoginInput = z.infer<typeof loginSchema>;


export interface IUserResponse {
  success: boolean;
  user: IUser;
}

