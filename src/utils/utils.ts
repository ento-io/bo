import Parse, { Attributes } from "parse";

export const initParse = () => {
  Parse.initialize("ento.io");

  const {origin} = window.location;
  
  const LOCAL = origin.includes('localhost') || origin.includes('127.0.0.1');
  const PREPROD = origin.includes('preprod');
  const PROD = !LOCAL && !PREPROD;
  
  (window as any).LOCAL = LOCAL;
  (window as any).PREPROD = PREPROD;
  (window as any).PROD = PROD;
  
  const parseServerURL = LOCAL ? 'http://localhost:8082/parse' : `${origin}/parse`;
  
  Parse.serverURL = parseServerURL;
}


export const getUserFullName = (user: any) => {
  return `${user.get('firstName')} ${user.get('lastName')}`;
}


/**
 * check if it's null ( 0, '', null, undefined, {}, [] )
 * @param item
 * @returns {boolean}
 */
export const isNull = (item: string): boolean => {
  // NOTE : typeof null = 'object', typeof undefined = 'undefined'
  // see Loose Equality Comparisons With == at ( https://www.sitepoint.com/javascript-truthy-falsy )
  const typeOfValue = typeof item;
  switch (typeOfValue) {
    case 'string':
      return item.trim() === '';
    case 'object':
      return Object.is(item, null) || Object.values(item).every(val => isNull(val));
    case 'number':
      return !item;
    default:
      return item == null;
  }
};

export const setValue = (parseObject: Attributes, name: string, value: any): void => {
  const oldValue = parseObject.get(name);
  if (isNull(value)) {
    parseObject.unset(name);
  } else if (oldValue !== value) {
    parseObject.set(name, value);
  }
};

/**
 * @param object
 * @param {array|Set} names
 * @returns {*}
 */
export const filter = (object: Record<string, any>, names: Record<string, any>): Record<string, any> => {
  return Object.keys(object)
    .filter(key => (names.has ? names.has(key) : names.includes(key)))
    .reduce((obj, key) => {
      // eslint-disable-next-line no-param-reassign
      (obj as any)[key] = object[key];
      return obj;
    }, {});
};

/**
 * . null or undefined values aren't set
 * . a value is set only when it's different
 * @param parseObject
 * @param values
 * @param {Array|Set} names (optional), ensures we only set the right properties
 */
export const setValues = (parseObject: Attributes, values: Record<string, any>, names: Record<string, any>): void => {
  let newValues = { ...values };
  if (names) {
    newValues = filter(newValues, names);
  }
  for (const key in newValues) {
    /* eslint-disable-next-line no-prototype-builtins */
    if (!newValues.hasOwnProperty(key)) {
      /* eslint-disable-next-line no-continue */
      continue;
    }
    const value = newValues[key];
    setValue(parseObject, key, value);
  }
};