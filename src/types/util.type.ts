import { Dayjs } from "dayjs";
import { ISelectOption } from "./app.type";

export type DateType = string | number | Date | Dayjs | null | undefined;

// in database, it's a date type, but Parse Server extract the date with this type
export type ParseServerDate = {
  __type: string;
  iso: Date;
};

export type IOnRouteEnterInput = {
  params?: any;
  searchParams?: any;
  location?: any;
};

export type PlatformType = 'ios' | 'android' | 'macos' | 'windows' | 'web' | 'native' | 'bo';

export interface ICreatableSelectOption extends Partial<ISelectOption> {
  inputValue?: any;
  disabled?: boolean;
}
