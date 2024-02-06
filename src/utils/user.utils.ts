export const getUserFullName = (user: Parse.User): string => {
  return `${user.get('firstName')} ${user.get('lastName')}`;
}