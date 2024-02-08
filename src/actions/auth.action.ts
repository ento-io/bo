import Parse from "parse";

import { setValues } from "@/utils/utils";
import { ILoginInput, ISignUpInput } from "@/types/auth.types";

const SIGNUP_PROPERTIES = new Set(['email', 'password', 'username', 'firstName', 'lastName']);

export const signUp = async (values: ISignUpInput): Promise<Parse.Object> => {
  try {
    const newValues = { username: values.email, ...values };

    const user = new Parse.User();
    setValues(user, newValues, SIGNUP_PROPERTIES);

    const createdUser = await user.signUp();
    return createdUser
  } catch (error) {
    console.log('error: ', error);
    return Promise.reject(error);
  }
}

export const login = async (values: ILoginInput): Promise<Parse.Object> => {
  try {
    const user = await Parse.User.logIn(values.email, values.password);
    return user;
  } catch (error) {
  
    return Promise.reject(error);
  }
}

export const getCurrentUser = async (): Promise<Parse.User | undefined> => {
  try {
    const user = await Parse.User.currentAsync();

    return user as Parse.User
  } catch (error) {
    return Promise.reject(error);
  }
}

export const logout = async (): Promise<void> => {
  try {
    await Parse.User.logOut()

  } catch (error) {
    return Promise.reject(error);
  }
}

// export const onEnterDashboard = async (): Promise<null | Response> => {
//   console.log('onEnterDashboard: ');

//   const user = await getCurrentUser();
//   console.log('user: ', user);
//   if (user) return null;
//   return redirect('/login');
// }