import { useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PageForm from "@/containers/pages/PageForm";
import { deletePage, editPage, goToAddPage, goToPage, goToPages } from "@/redux/actions/page.action";
import { getPagePageSelector } from "@/redux/reducers/page.reducer";
import { IPageInput } from "@/types/page.types";
import ActionsMenu from "@/components/ActionsMenu";
import Head from "@/components/Head";
import Layout from "@/components/layouts/Layout";
import { useProtect } from "@/hooks/useProtect";

const EditPage = () => {
  const { t } = useTranslation(['common', 'user', 'cms']);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const page = useSelector(getPagePageSelector);
  const { canPreview, canDelete, canCreate, canFind } = useProtect('Page');

  if (!page) return null;

  const handlePreview = () => {
    if (!canPreview) return;
    navigate(goToPage(page.objectId));
  }

  const handleDelete = () => {
    if (!canDelete) return;
    navigate(deletePage(page.objectId));
  }

  const handleGoToList = () => {
    if (!canFind) return;
    navigate(goToPages());
  };

  const handleCreate = () => {
    if (!canCreate) return;
    navigate(goToAddPage());
  }

  const handleSubmitPage = async (values: IPageInput) => {
    if (!page) return;
    await dispatch(editPage(page.objectId, values));
    navigate(goToPage(page.objectId));
  }

  return (
    <Layout
      title={(
        <span css={{ marginRight: 10 }}>{t('cms:editPage', { title: page.objectId})}</span>
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
      <Head title={t('cms:editPage', { title: page.objectId})} />

      <PageForm
        onSubmit={handleSubmitPage}
        page={page}
      />
    </Layout>
  )
}

export default EditPage