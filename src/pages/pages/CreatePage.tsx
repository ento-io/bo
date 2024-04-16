import { useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PageForm from "../../containers/pages/PageForm";
import { createPage, goToPage, goToPages } from "@/redux/actions/page.action";
import { getPagePageSelector } from "@/redux/reducers/page.reducer";
import { IPageInput } from "@/types/page.type";
import Layout from "@/components/layouts/Layout";
import ActionsMenu from "@/components/ActionsMenu";
import Head from "@/components/Head";
import { useProtect } from "@/hooks/useProtect";

const CreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { canFind } = useProtect('Page');

  const newPage = useSelector(getPagePageSelector);

  useEffect(() => {
    if (!newPage) return;
    navigate(goToPage(newPage.objectId));
  }, [newPage, navigate]);

  const handleGoToList = () => {
    if (!canFind) return;
    navigate(goToPages())
  };
  
  const handleSubmitPage = (values: IPageInput) => {
    dispatch(createPage(values));
  }

  return (
    <Layout
      title={(
        <span css={{ marginRight: 10 }}>{t('cms:newPage')}</span>
      )}
      isCard={false}
      actions={
        <ActionsMenu goToList={handleGoToList} />
      }>
      <Head title={t('cms:createPage')} />
      <PageForm
        onSubmit={handleSubmitPage}
      />          
    </Layout>
  )
}

export default CreatePage