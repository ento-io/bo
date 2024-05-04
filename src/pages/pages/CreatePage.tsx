import { useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PageForm from "../../containers/pages/pageForms/PageForm";
import { createPage, goToPages } from "@/redux/actions/page.action";
import { getPagePageSelector } from "@/redux/reducers/page.reducer";
import { IPageInput } from "@/types/page.type";
import Layout from "@/components/layouts/Layout";
import ActionsMenu from "@/components/ActionsMenu";
import Head from "@/components/Head";
import { useProtect } from "@/hooks/useProtect";
import { goToAddPageBlocks } from "@/redux/actions/pageBlock.action";

const CreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { canFind } = useProtect('Page');

  const newPage = useSelector(getPagePageSelector);

  useEffect(() => {
    if (!newPage) return;
    navigate(goToAddPageBlocks(newPage.objectId));
  }, [newPage, navigate]);

  const handleGoToList = () => {
    if (!canFind) return;
    navigate(goToPages())
  };
  
  const handleSubmitPage = async (values: IPageInput) => {
    await dispatch(createPage(values, ));
  }

  return (
    <Layout
      title={t('cms:newPage')}
      isCard={false}
      actions={<ActionsMenu goToList={handleGoToList} />}
    >
      <Head title={t('cms:createPage')} />
      <PageForm onSubmit={handleSubmitPage} />
    </Layout>
  )
}

export default CreatePage