
import Parse from 'parse';
import { IChangePasswordInput, ILoginInput, ResetPasswordInput, ISignUpInput } from '@/types/auth.types';
import { IUser } from '@/types/user.type';
import { IOnRouteEnterInput } from '@/types/util.type';
import i18n from '@/config/i18n';

import { actionWithLoader } from '@/utils/app.utils';
import { DISABLE_USER_ACCOUNT_CONFIRMATION } from '@/utils/constants';
import { clearUserIntoLocalStorage, retrieveUserFromLocalStorage, updateUserIntoLocalStorage } from '@/utils/user.utils';
import { setValues } from '@/utils/parse.utils';

import { AppDispatch, RootState } from '@/redux/store';
import { setUserLoadingSlice, clearUsersSlice } from '@/redux/reducers/user.reducer';

import {
  setErrorSlice,
  loadCurrentUserSlice,
  setMessageSlice,
  closeErrorSlice,
  getAppAccountEmailSelector,
  setAccountEmailSlice,
  clearAccountEmailSlice,
  setAlertSlice,
  clearAlertSlice,
  getAppCurrentUserSelector,
  clearCurrentUserSlice,
} from '@/redux/reducers/app.reducer';
import { toggleIsAuthenticatedSlice } from '@/redux/reducers/settings.reducer';
import { INavigate } from '@/types/app.type';
import { PATH_NAMES } from '@/utils/pathnames';

export const SIGNUP_PROPERTIES = new Set(['firstName', 'lastName', 'email', 'password', 'username']);

interface SignUpI extends Partial<ISignUpInput> {
  username: string;
}
/**
 * create user account
 * @param values
 * @returns
 */
export const signUp = (values: ISignUpInput, navigate: INavigate): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState) => {
    const state = getState?.();

    if ((state as any)?.app.error) {
      dispatch(closeErrorSlice());
    }

    const newValues: SignUpI = { ...values, username: values.email };
    delete newValues.passwordConfirmation; // passwordConfirmation should not be saved to db

    // create the new user with corresponding fields
    const user = new Parse.User();
    setValues(user, newValues, SIGNUP_PROPERTIES);

    try {
      await user.signUp();
      // * This should be placed elsewhere:
      // * I moved it in the ConfirmEmail component

      // accountCreatedSuccessfully
      // by default, it logged in automatically after the user is created
      // we need to login manually after the user is created
      // so we logged out the newly created user and redirect to the login page
      navigate({ to: PATH_NAMES.logout })
      // instead of redirecting to the login page,
      // redirect to the email confirmation page.
      // And pass the email to the the ConfirmEmail Page Component
      if (!DISABLE_USER_ACCOUNT_CONFIRMATION) {
        // dispatch(goToAccountVerificationCode());
      }
    } catch (error) {
      // account already exists
      if ((error as any).code === 202) {
        dispatch(setErrorSlice(i18n.t('user:errors.usernameTaken')));
      }
    }
  }, setUserLoadingSlice);
};

/**
 * check connected user
 * @returns {function(*=, *=): Promise<void>}
 */
export const loginSuccess = (redirectToHome?: boolean, navigate?: INavigate): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState) => {
    const state = getState?.() as RootState;
    // current user from parse or from store (not persisted)
    const currentUser = (await Parse.User.currentAsync()) ?? getAppCurrentUserSelector(state);
    dispatch(clearAccountEmailSlice());
  
    // ------------------------------------------//
    // ------------- login success --------------//
    // ------------------------------------------//
    if (currentUser?.getSessionToken()) {
      // it may be a parse type (so need to transform it to json)
      const userJson = currentUser.className ? currentUser.toJSON() : currentUser;
      dispatch(loadCurrentUserSlice(userJson as IUser));
      dispatch(toggleIsAuthenticatedSlice(true));

      // update user into localStorage
      updateUserIntoLocalStorage(userJson as IUser);

      // navigate is only available in a component (from hooks)
      if (redirectToHome && navigate) {
        // redirection after login
        navigate({ to: PATH_NAMES.home });
      }

      return;
    }

    // ------------------------------------------//
    // ------------- login failed ---------------//
    // ------------------------------------------//
    dispatch(setErrorSlice(i18n.t('user:error.sessionTokenExpired')));
    if (!navigate) return;
    // retry login
    // navigate is only available in a component (from hooks)
    navigate({ to: PATH_NAMES.login });
  });
};

/**
 * login with email and password
 * @param values
 * @returns
 */
export const login = (values: ILoginInput, navigate: INavigate): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState) => {
    const state = getState?.();

    if ((state as any)?.app.error) {
      dispatch(closeErrorSlice());
    }

    try {
      await Parse.User.logIn(values.email, values.password);

      dispatch(loginSuccess(true, navigate)); // redirect
    } catch (error) {
      console.log('login error: ', error);
      // invalid username / email error
      if (!DISABLE_USER_ACCOUNT_CONFIRMATION) {
        if ((error as any).code === 141) {
          dispatch(setErrorSlice(i18n.t('user:errors.userNotVerified')));
          // dispatch(goToAccountVerificationCode());
          dispatch(setAccountEmailSlice(values.email));
        }
      }
      if ((error as any).code === 101) {
        dispatch(setErrorSlice(i18n.t('user:errors.invalidUsername')));
      }
    }
  }, setUserLoadingSlice);
};

export const logout = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    await Parse.User.logOut();
    // clear local storage
    clearUserIntoLocalStorage();

    // clear store
    dispatch(toggleIsAuthenticatedSlice(false));
    dispatch(clearUsersSlice());
    dispatch(clearCurrentUserSlice());
    // the redirection is in the root
  });
};

/**
 * check if user is logged in and if a session is valid
 * this should be used 
 * @returns
 */
export const checkSession = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch) => {
    let currentUser;
    // retrieve store user from local storage
    const userFromLocalStorage = retrieveUserFromLocalStorage(); // it should be before await Parse.User.currentAsync()
  
    try {
      currentUser = await Parse.User.currentAsync(); // it can throw (rarely)
      if (currentUser) {
        // is the session valid ? (some issues might happen)
        try {
          await Parse.Session.current();
        } catch (error) {
          console.log('Error retrieving the session object => 400 but, in fact, invalid token => logout');
          currentUser = null;

          throw new Error('Bad session');
        }
      }
    } catch (error) {
      const invalidSession = (error as any).message === 'Bad session';
      if (invalidSession) {
        // ---- bad session ----//
        // clean up user into localStorage
        clearUserIntoLocalStorage();
        dispatch(toggleIsAuthenticatedSlice(false));
        dispatch(setErrorSlice(i18n.t('user:errors.badSession')))
      }
  
      if ((currentUser && !currentUser.equals(userFromLocalStorage as any)) || invalidSession) {
        try {
          await Parse.User.logOut();
        } catch (err2) {
          // might happen, but swallowed
        }
      }
    }
  
    if (currentUser) {
      await dispatch(loginSuccess()); // no redirection if successful
    } else {
      // redirect to login if in dashboard
      // remain in the same page if in auth pages (login, signUp, ...)
      await dispatch(logout());
    }
  }, setUserLoadingSlice);
};

/**
 * change password
 * @param values
 * @returns
 */
export const changePassword = (values: IChangePasswordInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    const user = await Parse.User.currentAsync();

    if (!user) {
      dispatch(setErrorSlice(i18n.t('user:errors.noUserFound')));
      return;
    }

    user.set('password', values.newPassword);
    const updatedUser = await user.save();

    if (!updatedUser) return;

    dispatch(setMessageSlice(i18n.t('user:passwordWordChangedSuccess')));
  }, setUserLoadingSlice);
};

/**
 * delete the current user account
 * @returns
 */
export const deleteAccount = (): any => {
  return actionWithLoader(async (): Promise<void> => {
    console.log('delete account');
  }, setUserLoadingSlice);
};

export const verifyCodeSentByEmail = (code: string, type = 'resetPassword'): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    await Parse.Cloud.run('verifyAccountEmail', { code, type });

    if (type === 'accountVerification') {
      dispatch(
        setAlertSlice({
          type: 'accountVerification',
          severity: 'success',
          duration: 'permanent',
          message: i18n.t('user:messages.emailVerifiedSuccess'),
          title: i18n.t('user:messages.accountCreatedSuccessfully'),
        }),
      );
      // return;
    }

    // if (type === 'resetPassword') {
    //   // dispatch(goToResetPassword(result.email));
    //   return;
    // }

    // dispatch(goToHome());
  });
};

export const sendEmailVerificationCode = (email: string): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    await Parse.Cloud.run('sendVerificationCode', { email });

    dispatch(setMessageSlice(i18n.t('user:emailWithCodeSent')));
  }, setUserLoadingSlice);
};

export const sendResetPasswordVerificationCode = (email: string): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    await Parse.Cloud.run('sendResetPasswordVerificationCode', { email });

    dispatch(setMessageSlice(i18n.t('user:emailWithCodeSent')));
    // dispatch(goToResetPasswordConfirmCode());
  }, setUserLoadingSlice);
};

export const resetPassword = (values: ResetPasswordInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const accountEmail = getAppAccountEmailSelector(state as any);

    await Parse.Cloud.run('resetPassword', { email: accountEmail, password: values.newPassword });

    dispatch(
      setAlertSlice({
        severity: 'success',
        duration: 'permanent',
        title: i18n.t('user:messages.passwordResetSuccess'),
      }),
    );
  }, setUserLoadingSlice);
};

// ---------------------------------------- //
// ------------- on page load ------------- //
// ---------------------------------------- //
export const onEnterResetPassword = ({ params }: IOnRouteEnterInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch) => {
    await Parse.Cloud.run('isUserExistsByEmail', { email: params.email });

    dispatch(setAccountEmailSlice(params.email));
  });
};

// ---------------------------------------- //
// ------------- on page leave ------------ //
// ---------------------------------------- //
export const onLeaveResetPassword = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch) => {
    dispatch(clearAccountEmailSlice());
  });
};

export const onCodeConfirmationLeave = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch) => {
    dispatch(clearAlertSlice());
  });
};

export const onSignUpLeave = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch) => {
    dispatch(clearAccountEmailSlice());
  });
};

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
// export const goToLogin = (): UpdateLocationActions => push('/' + PATH_NAMES.login);
// export const goToSignUp = (): UpdateLocationActions => push('/' + PATH_NAMES.signUp);
// export const goToChangePassword = (): UpdateLocationActions => push('/' + PATH_NAMES.changePassword);
// export const goToProfile = (): UpdateLocationActions => push('/' + PATH_NAMES.profile);
// export const goToSendEmailResetPassword = (): UpdateLocationActions => {
//   return push('/' + PATH_NAMES.account.root + '/' + PATH_NAMES.account.resetPassword);
// };
// export const goToResetPasswordConfirmCode = (): UpdateLocationActions => {
//   return push('/' + PATH_NAMES.account.root + '/' + PATH_NAMES.account.confirmResetPasswordCode);
// };
// export const goToResetPassword = (email: string): UpdateLocationActions =>
//   push('/' + PATH_NAMES.account.root + '/' + PATH_NAMES.account.resetPassword + '/' + email);

// export const goToAccountVerificationCode = (): UpdateLocationActions => {
//   return push('/' + PATH_NAMES.account.root + '/' + PATH_NAMES.account.verifyAccount);
// };
