import Parse from "parse";

import { setValues } from "@/utils/parse.utils";
import { EstimateInput } from "@/types/estimate.type";

const Estimate = Parse.Object.extend("Estimate");

const ESTIMATE_PROPERTIES = new Set(['url']);

export const createEstimate = async (values: EstimateInput): Promise<Parse.Object> => {
  try {
    const estimate = new Estimate();
    setValues(estimate, values, ESTIMATE_PROPERTIES);

    const savedEstimate = await estimate.save();

    return savedEstimate;
  } catch (error) {
    console.log('error: ', error);


    return Promise.reject(error);
  }
}