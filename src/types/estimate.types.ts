import { z } from "zod";
import { estimateSchema } from "@/validations/estimate.validation";



export type IEstimateInput = z.infer<typeof estimateSchema>;
