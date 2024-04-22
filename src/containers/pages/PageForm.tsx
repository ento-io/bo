import { useState } from "react"

import { IFinalPageInput, IPage, IPageInput } from "@/types/page.type"

import PageFormStepOne from "./PageFormStepOne";
import PageFormStepTwo from "./PageFormStepTwo";
import PageFormStepThree from "./PageFormStepThree";

type IStep = 1 | 2 | 3 | number;
type Props = {
  onSubmit: (values: IPageInput) => void;
  page?: IPage | null;
  loading?: boolean;
}

const PageForm = ({ onSubmit, page, loading }: Props) => {
  const [step, setStep] = useState<IStep>(1);
  const [finalValues, setFinalValues] = useState<IFinalPageInput | null>(null);

  // const onFormSubmit: SubmitHandler<IPageInput> = (values) => {
  //   onSubmit(values);
  //   reset(initialValues);
  // };

  const onFormSubmit = (step: IStep) =>(values: IFinalPageInput) => {
    console.log('step: ', step);
    // do not increment in last step
    if (step < 3) {
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
        if ((index + 1) !== step) return null;
        return (
          <Component
            key={index}
            onSubmit={onFormSubmit(index + 1)}
            page={page}
            loading={loading}
          />
        )
      })}
    </div>
  )
}

export default PageForm