import Parse, { Attributes } from "parse";
import { PATH_NAMES } from "@/utils/pathnames";
import { setValues } from "@/utils/parse.utils";
import { actionWithLoader } from "@/utils/app.utils";
import { AppDispatch } from "../store";
import { setMessageSlice } from "../reducers/app.reducer";
import i18n from "@/config/i18n";
import { addEstimateToEstimateSlice, loadEstimatesSlice } from "../reducers/estimate.reducer";
// import { ParseResult } from "@/types/util.type";

const Estimate = Parse.Object.extend("Estimate");

const ESTIMATE_PROPERTIES = new Set(['url']);

export const loadEstimates = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    // user from BO
    const result: any = await new Parse.Query(Estimate)
      .withCount()
      .notEqualTo('deleted', true)
      .find();

    const estimates = result.results.map((estimate: Attributes) => estimate.toJSON());

    dispatch(loadEstimatesSlice(estimates));
  });
};

export const createEstimate = (values: any): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const estimate = new Estimate()

    setValues(estimate, values, ESTIMATE_PROPERTIES);

    estimate.set("url", values.url)

    const savedEstimate = await estimate.save();
    dispatch(setMessageSlice(i18n.t('common:estimateCreatedSuccessfully')));
    dispatch(addEstimateToEstimateSlice((savedEstimate as Attributes).toJSON()));
    // return savedEstimate;
  });
};

export const onEstimatesEnter = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {

    dispatch(loadEstimates());
  });
};


// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToEstimates = () => ({ to: PATH_NAMES.estimates });
