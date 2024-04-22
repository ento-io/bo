import { useState } from "react"

import { useTranslation } from "react-i18next";
import { IFinalPageInput, IPage, IPageInput } from "@/types/page.type"

import PageFormStepOne from "./PageFormStepOne";
import PageFormStepTwo from "./PageFormStepTwo";
import PageFormStepThree from "./PageFormStepThree";

type IStep = 1 | 2 | 3 | number;

const lastStep = 3;

type Props = {
  onSubmit: (values: IPageInput) => void;
  page?: IPage | null;
  loading?: boolean;
}

const PageForm = ({ onSubmit, page, loading }: Props) => {
  const { t } = useTranslation();

  const [step, setStep] = useState<IStep>(1);
  const [finalValues, setFinalValues] = useState<IFinalPageInput | null>(null);

  const onFormSubmit = (step: IStep) =>(values: IFinalPageInput) => {
    // do not increment in last step
    if (step < lastStep) {
      // increment the step
      setStep((prev) => prev + 1);
      // store the values of each form step in the finalValues state
      setFinalValues((prev: IFinalPageInput | null) => ({ ...prev, [step]: values }));
      return ;
    }


    // if the step is the last one, submit the form
    const allValues = Object.values({ ...finalValues, [step]: values})
      .reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});

    onSubmit(allValues);
  };

  return (
    <div>
      {[PageFormStepOne, PageFormStepTwo, PageFormStepThree].map((Component, index) => {
        // display only the current step
        const currentStep = index + 1;
        if (currentStep !== step) return null;
        return (
          <Component
            key={index}
            onSubmit={onFormSubmit(currentStep)}
            page={page}
            loading={loading}
            buttonText={currentStep === lastStep
              ? t('common:nextStep', { step, total: lastStep })
              : t('common:terminateAndSaveStep', { step, total: lastStep })
            }
          />
        )
      })}
    </div>
  )
}

export default PageForm