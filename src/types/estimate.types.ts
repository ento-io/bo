import { Attributes } from "parse";
import { z } from "zod";
import { IUser } from "./user.type";
import { estimateFilterSchema, estimateSchema } from "@/validations/estimate.validation";

export interface IEstimate extends Attributes {
  objectId: string;
  title: string;
  reference: string;
  updatedAt?: string;
  createdAt?: string;
  user: IUser;
  updatedBy?: IUser;
  deletedBy?: IUser;
}

export interface IEstimateState {
  loading: boolean;
  estimate: IEstimate | null;
  estimates: IEstimate[];
  count: number;
  filters: Record<string, string | boolean> | null;
}

export type EstimateInput = z.infer<typeof estimateSchema>;
export type EstimateFiltersInput = z.infer<typeof estimateFilterSchema>;

