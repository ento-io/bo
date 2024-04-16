import { useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ArticleForm from "../../containers/articles/ArticleForm";
import { createArticle, goToArticle, goToArticles } from "@/redux/actions/article.action";
import { getArticleArticleSelector } from "@/redux/reducers/article.reducer";
import { IArticleInput } from "@/types/article.types";
import Layout from "@/components/layouts/Layout";
import ActionsMenu from "@/components/ActionsMenu";
import Head from "@/components/Head";
import { useProtect } from "@/hooks/useProtect";

const CreateArticle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { canFind } = useProtect('Article');

  const newArticle = useSelector(getArticleArticleSelector);

  useEffect(() => {
    if (!newArticle) return;
    navigate(goToArticle(newArticle.objectId));
  }, [newArticle, navigate]);

  const handleGoToList = () => {
    if (!canFind) return;
    navigate(goToArticles())
  };
  
  const handleSubmitArticle = (values: IArticleInput) => {
    dispatch(createArticle(values));
  }

  return (
    <Layout
      title={(
        <span css={{ marginRight: 10 }}>{t('cms:newArticle')}</span>
      )}
      isCard={false}
      actions={
        <ActionsMenu goToList={handleGoToList} />
      }>
      <Head title={t('cms:createArticle')} />
      <ArticleForm
        onSubmit={handleSubmitArticle}
      />          
    </Layout>
  )
}

export default CreateArticle