import Parse from "parse";
import { PATH_NAMES } from "@/utils/pathnames";
import { setValues } from "@/utils/parse.utils";
import { actionWithLoader } from "@/utils/app.utils";
import { AppDispatch } from "../store";
import { setMessageSlice } from "../reducers/app.reducer";
import i18n from "@/config/i18n";

const Invoice = Parse.Object.extend("Invoice");

const INVOICE_PROPERTIES = new Set(['url']);

export const createInvoice = (values: any): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const invoice = new Invoice()

    setValues(invoice, values, INVOICE_PROPERTIES);

    invoice.set("supplierName", values.supplierName)

    const savedInvoice = await invoice.save();
    dispatch(setMessageSlice(i18n.t('common:invoiceCreatedSuccessfully')));
    return savedInvoice;
  });
};


// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToInvoices = () => ({ to: PATH_NAMES.estimates });
