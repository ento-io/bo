
import { actionWithLoader } from "@/utils/app.utils";
import { PATH_NAMES } from "@/utils/pathnames";
import { AppDispatch } from "../store";
import { setMessageSlice } from "../reducers/app.reducer";
import i18n from "@/config/i18n";
import { EstimateInput } from "@/types/estimate.type";

export const createEstimate = (values: EstimateInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
  console.log('values: ', values);

    dispatch(setMessageSlice(i18n.t('common:estimateCreatedSuccessfully')))
  });
};


// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToEstimates = () => ({ to: PATH_NAMES.estimates });
