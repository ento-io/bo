import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { t } from "i18next";
import { IArticle, IArticleInput } from "@/types/article.types"
import TextField from "@/components/form/fields/TextField";
import Form from "@/components/form/Form";
import { articleSchema } from "@/validations/article.validations";
import TextEditorField from "@/components/form/fields/TextEditorField";

const initialValues = {
  title: '',
  content: '',
};

type Props = {
  onSubmit: (values: IArticleInput) => void;
  article?: IArticle | null;
  loading?: boolean;
}

const ArticleForm = ({ onSubmit, article, loading }: Props) => {
  const form = useForm<IArticleInput>({
    defaultValues: initialValues,
    resolver: zodResolver(articleSchema),
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (!article) return;
    reset({
      title: article.title,
      content: article.content,
    })
  }, [article, reset])

  const onFormSubmit: SubmitHandler<IArticleInput> = (values) => {
    onSubmit(values);
    reset(initialValues);
  }

  return (
    <Form form={form} onSubmit={handleSubmit(onFormSubmit)} loading={loading}>
      <TextField
        label={t('cms:title')}
        name="title"
      />
      <TextEditorField
        className="flexColumn spaceBetween stretchSelf flex1"
        name="content"
        label={t('cms:content')}
        // placeholder="Provide as much information as possible. This field has only one limit, yours."
        // menuClassName={classes.textEditorMenu}
      />
    </Form>
  )
}

export default ArticleForm