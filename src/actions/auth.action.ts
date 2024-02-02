import Parse from "parse";

import { ILoginInput, ISignUpInput } from "../types/auth.types";

export const signUp = async (values: ISignUpInput): Promise<Parse.Object> => {
  try {
    const user = new Parse.User();
    user.set('username', values.email);
    user.set('firstName', values.firstName);
    user.set('lastName', values.lastName);
    user.set('email', values.email);
    user.set('password', values.password);

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