import { useState } from "react"

import { useTranslation } from "react-i18next";
import { IPageInput, IPage } from "@/types/page.type"

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
  const [finalValues, setFinalValues] = useState<IPageInput | null>(null);

  const handlePrevious = () => {
    // do not decrement if the step is the first one
    if (step === 1) return;
    // decrement the step
    setStep((prev) => prev - 1);
  }

  const onFormSubmit = (step: IStep) =>(values: IPageInput) => {
    // do not increment in last step
    if (step < lastStep) {
      // increment the step
      setStep((prev) => prev + 1);
      // store the values of each form step in the finalValues state
      setFinalValues((prev: IPageInput | null) => ({ ...prev, [step]: values }));
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
            // no previous button in the first step
            onSecondaryButtonClick={currentStep !== 1 ? handlePrevious : undefined}
            buttonDirection={currentStep === 1 ? 'column' : 'row'}
            primaryButtonText={currentStep === lastStep
              ? t('common:terminateAndSaveStep', { step, total: lastStep })
              : t('common:nextStep', { step, total: lastStep })
            }
            secondaryButtonText={currentStep !== 1
              ? t('common:previous')
              : ''
            }
          />
        )
      })}
    </div>
  )
}

export default PageForm