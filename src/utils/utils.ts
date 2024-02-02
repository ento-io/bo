// export const authenticateAPI = (http: any) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
//   }
// }

export const authenticateAPI = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    return {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
  }
}

export const getUserFullName = (user: any) => {
  return `${user.get('firstName')} ${user.get('lastName')}`;
}