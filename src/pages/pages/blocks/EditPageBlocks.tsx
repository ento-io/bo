import { useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { goToPage, goToPages } from "@/redux/actions/page.action";
import { getPagePageSelector } from "@/redux/reducers/page.reducer";
import { IPageBlocksInput } from "@/types/page.type";
import Layout from "@/components/layouts/Layout";
import ActionsMenu from "@/components/ActionsMenu";
import Head from "@/components/Head";
import { useProtect } from "@/hooks/useProtect";
import PageBlocksForm from "@/containers/pages/PageBlocksForm";
import { getTranslatedField } from "@/utils/settings.utils";
import { getSettingsLangSelector } from "@/redux/reducers/settings.reducer";
import { editPageBlocks } from "@/redux/actions/pageBlock.action";

const EditPageBlocks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { canPreview, canFind } = useProtect('Page');

  const language = useSelector(getSettingsLangSelector);
  const page = useSelector(getPagePageSelector);

  const pageTitle = getTranslatedField(page.translated, language, 'title');

  const handleGoToList = () => {
    if (!canFind) return;
    navigate(goToPages());
  };

  const handleGoToPage = () => {
    navigate(goToPage(page.objectId));
  };
  
  const handleSubmit = async (values: IPageBlocksInput) => {
    if (!page) return;
    await dispatch(editPageBlocks(page.objectId, values));
    if (!canPreview) return;
    handleGoToPage();
  }

  return (
    <Layout
      title={t('cms:editBlocksForPage', { title: pageTitle })}
      isCard={false}
      actions={
        <ActionsMenu goToList={handleGoToList} onPreview={handleGoToPage} />
      }>
      <Head title={t('cms:editBlocksForPage', { title: pageTitle })} />
      <PageBlocksForm
        onSubmit={handleSubmit}
      />          
    </Layout>
  )
}

export default EditPageBlocks