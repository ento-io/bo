import Parse, { Attributes } from "parse";
import { PATH_NAMES } from "@/utils/pathnames";
import { setValues } from "@/utils/parse.utils";
import { actionWithLoader } from "@/utils/app.utils";
import { AppDispatch, RootState } from "../store";
import { setMessageSlice } from "../reducers/app.reducer";
import i18n from "@/config/i18n";
import { addEstimateToEstimateSlice, deleteEstimateFromEstimatesSlice, loadEstimatesSlice } from "../reducers/estimate.reducer";

const Estimate = Parse.Object.extend("Estimate");

const ESTIMATE_PROPERTIES = new Set(['url']);

export const getEstimate = async (id: string): Promise<Parse.Object | undefined> => {
  const estimate = await new Parse.Query(Estimate)
    .equalTo('objectId', id)
    .include(["comments"])
    .notEqualTo('deleted', true)
    .first();

    console.log("id estimate ---------:", id);

  if (!estimate) {
    throw new Error("Estimate not found");
  }
  return estimate;
}

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
  });
};

export const deleteEstimate = (id: string,): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const estimate = await getEstimate(id);

    if (!estimate) return;

    estimate.set('deleted', true);
    const deletedEstimate = await estimate.save();
    
    dispatch(deleteEstimateFromEstimatesSlice(deletedEstimate.id));
    
    dispatch(setMessageSlice('Estimate deleted successfully'));
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
