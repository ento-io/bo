import { useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { goToPage, goToPages } from "@/redux/actions/page.action";
import { getPagePageSelector } from "@/redux/reducers/page.reducer";
import { IPageBlocksInput } from "@/types/page.type";
import Layout from "@/components/layouts/Layout";
import ActionsMenu from "@/components/ActionsMenu";
import Head from "@/components/Head";
import { useProtect } from "@/hooks/useProtect";
import PageBlocksForm from "@/containers/pages/pageBlockForms/PageBlocksForm";
import { getTranslatedField } from "@/utils/settings.utils";
import { getSettingsLangSelector } from "@/redux/reducers/settings.reducer";
import { addBlocksToPage } from "@/redux/actions/pageBlock.action";

const CreatePageBlocks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { canFind, canPreview } = useProtect('Page');

  const language = useSelector(getSettingsLangSelector);
  const page = useSelector(getPagePageSelector);

  if (!page) return null;
  
  const pageTitle = getTranslatedField(page.translated, language, 'title');

  const handleGoToList = () => {
    if (!canFind) return;
    navigate(goToPages())
  };

  const handleGoToPage = () => {
    navigate(goToPage(page.objectId))
  };
  
  const handleSubmit = async (values: IPageBlocksInput) => {
    if (!page) return;
    await dispatch(addBlocksToPage(page.objectId, values));
    if (!canPreview) return;
    navigate(goToPage(page.objectId));
  }

  return (
    <Layout
      title={t('cms:createBlocksForPage', { title: pageTitle })}
      isCard={false}
      actions={
        <ActionsMenu goToList={handleGoToList} onPreview={handleGoToPage} />
      }>
      <Head title={t('cms:createBlocksForPage', { title: pageTitle })} />
      <PageBlocksForm onSubmit={handleSubmit} />
      <div css={{ marginTop: 12 }}>
        <Button onClick={handleGoToPage} variant="outlined" fullWidth>
          {t('common:cancel')}
        </Button>
      </div>
    </Layout>
  )
}

export default CreatePageBlocks