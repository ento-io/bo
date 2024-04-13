import { useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ArticleForm from "@/containers/articles/ArticleForm";
import { deleteArticle, editArticle, goToAddArticle, goToArticle, goToArticles } from "@/redux/actions/article.action";
import { getArticleArticleSelector } from "@/redux/reducers/article.reducer";
import { IArticleInput } from "@/types/article.types";
import ActionsMenu from "@/components/ActionsMenu";
import Head from "@/components/Head";
import Layout from "@/components/layouts/Layout";
import { useProtect } from "@/hooks/useProtect";

const EditArticle = () => {
  const { t } = useTranslation(['common', 'user', 'cms']);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const article = useSelector(getArticleArticleSelector);
  const { canPreview, canDelete, canCreate, canFind } = useProtect('Article');

  if (!article) return null;

  const handlePreview = () => {
    if (!canPreview) return;
    navigate(goToArticle(article.objectId));
  }

  const handleDelete = () => {
    if (!canDelete) return;
    navigate(deleteArticle(article.objectId));
  }

  const handleGoToList = () => {
    if (!canFind) return;
    navigate(goToArticles());
  };

  const handleCreate = () => {
    if (!canCreate) return;
    navigate(goToAddArticle());
  }

  const handleSubmitArticle = async (values: IArticleInput) => {
    if (!article) return;
    await dispatch(editArticle(article.objectId, values));
    navigate(goToArticle(article.objectId));
  }

  return (
    <Layout
      title={(
        <span css={{ marginRight: 10 }}>{t('cms:editArticle', { title: article.objectId})}</span>
      )}
      isCard={false}
      actions={
        <ActionsMenu
          goToList={handleGoToList}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onCreate={handleCreate}
        />
      }>
      <Head title={t('cms:editArticle', { title: article.objectId})} />

      <ArticleForm
        onSubmit={handleSubmitArticle}
        article={article}
      />
    </Layout>
  )
}

export default EditArticle