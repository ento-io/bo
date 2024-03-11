import { z } from "zod";
import { estimateSchema } from "@/validations/estimate.validation";

export type EstimateInput = z.infer<typeof estimateSchema>;
