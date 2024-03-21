import { z } from "zod";
import { Attributes } from "parse";
import { estimateSchema } from "@/validations/estimate.validation";

export type EstimateInput = z.infer<typeof estimateSchema>;

export interface IEstimate extends Attributes {
  id: string;
  url: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface IEstimateState {
  loading: boolean;
  estimate: IEstimate | null;
  estimates: IEstimate[];
}