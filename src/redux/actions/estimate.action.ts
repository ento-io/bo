import Parse from "parse";
import { PATH_NAMES } from "@/utils/pathnames";
import { setValues } from "@/utils/parse.utils";
import { actionWithLoader } from "@/utils/app.utils";
import { AppDispatch } from "../store";
import { setMessageSlice } from "../reducers/app.reducer";
import i18n from "@/config/i18n";

const Estimate = Parse.Object.extend("Estimate");

const ESTIMATE_PROPERTIES = new Set(['url']);

export const createEstimate = (values: any): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const estimate = new Estimate()

    setValues(estimate, values, ESTIMATE_PROPERTIES);

    estimate.set("url", values.url)

    const savedEstimate = await estimate.save();
    dispatch(setMessageSlice(i18n.t('common:estimateCreatedSuccessfully')));
    return savedEstimate;
  });
};


// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToEstimates = () => ({ to: PATH_NAMES.estimates });
