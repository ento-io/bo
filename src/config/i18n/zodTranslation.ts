import i18n, { TOptions } from 'i18next';

class TranslatedString extends String {
  private readonly restArgs: (TOptions | string)[];

  constructor(private readonly key: string, ...restArgs: (TOptions | string)[]) {
    // if we used something else than an empty string here,
    // we would see the string being transformed to an array of chars
    // (seen in IntelliJ debugger)
    super('');

    this.restArgs = restArgs;
  }

  toString(): string {
    return i18n.t(this.key, ...this.restArgs);
  }
}

/**
 * Use this for localization of zod messages.
 * The function has to be named `t` because it mimics the `t` function from `i18next`
 * thus our IDE provides code completion and static analysis of translation keys.
 */
export const t = (
  key: string,
  options: { path: string | string[] } | Record<string, unknown> = {},
): { message: string; path?: string[] } => {
  const message: string = new TranslatedString(key, options) as unknown as string;
  const { path } = options;

  if (path === undefined) return { message };

  return {
    message,
    path: typeof path === 'string' ? [path] : (path as string[]),
  };
};
