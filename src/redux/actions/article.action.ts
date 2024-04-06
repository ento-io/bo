import Parse, { Attributes } from 'parse';

import { actionWithLoader } from '@/utils/app.utils';

import { AppDispatch, AppThunkAction } from '@/redux/store';

import { PATH_NAMES } from '@/utils/pathnames';
import { clearArticleSlice, deleteArticleFromArticlesSlice, loadArticleSlice, loadArticlesSlice, setArticlesCountSlice } from '../reducers/article.reducer';
import { setMessageSlice } from '../reducers/app.reducer';
import i18n from '@/config/i18n';
import { IArticleInput } from '@/types/article.types';


const Article = Parse.Object.extend("Article");

export const getArticle = async (id: string): Promise<Parse.Object | undefined> => {
  const article = await new Parse.Query(Article)
    .equalTo('objectId', id)
    .equalTo('deleted', false)
    .first();

  if (!article) {
    throw new Error(i18n.t('cms:errors.articleNotFound'));
  }
  return article;
}

// ----------------------------------------------------- //
// ------------------- Redux Actions ------------------- //
// ----------------------------------------------------- //

export const loadArticles = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    // user from BO
    const result: any = await new Parse.Query(Article)
      .withCount()
      .notEqualTo('deleted', true)
      .find();

    const articles = result.results.map((article: Attributes) => article.toJSON());

    dispatch(loadArticlesSlice(articles));
    dispatch(setArticlesCountSlice(result.count));
  });
};



/**
 * for user security reason, we do not delete the data from db
 * instead we just add a field "deleted" = true
 * @param id
 * @param redirectToRecycleBin redirect to recycle bin after the request is deleted
 * @returns
 */
export const deleteArticle = (id: string,): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const article = await getArticle(id);

    if (!article) return;

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    article.set('deleted', true);
    const deletedArticle = await article.save();
    dispatch(deleteArticleFromArticlesSlice(deletedArticle.id));
    
    dispatch(setMessageSlice('Article deleted successfully'));
  });
};

export const createArticle = (values: IArticleInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const article = new Article()

    article.set("title", values.title);

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const savedArticle = await article.save();
    dispatch(loadArticleSlice((savedArticle as Attributes).toJSON()));
  });
};

export const editArticle = (id: string, values: IArticleInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const article = await getArticle(id);

    if (!article) return;

    article.set("title", values.title);

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const savedArticle = await article.save();
    dispatch(loadArticleSlice((savedArticle as Attributes).toJSON()));
  });
};


// ---------------------------------------- //
// ------------- on page load ------------- //
// ---------------------------------------- //
export const onArticlesEnter = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {

    dispatch(loadArticles());
  });
};

export const onArticleEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    if (!route.params?.id) return ;

    const article = await getArticle(route.params?.id);

    if (!article) return;

    dispatch(loadArticleSlice((article as Parse.Attributes).toJSON()));
  });
};

export const onEditArticleEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    if (!route.params?.id) return ;

    const article = await getArticle(route.params?.id);

    if (!article) return;

    dispatch(loadArticleSlice((article as Parse.Attributes).toJSON()));
  });
};

export const onCreateArticleEnter = (): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {

    dispatch(clearArticleSlice());
  });
};

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToArticles = () => ({ to: PATH_NAMES.articles });
export const goToArticle = (id: string) => ({ to: PATH_NAMES.articles + '/$id', params: { id }});
export const goToAddArticle = () => ({ to: PATH_NAMES.articles + '/' + PATH_NAMES.create });
export const goToEditArticle = (id: string) => ({ to: PATH_NAMES.articles + '/$id/' + PATH_NAMES.edit, params: { id } });
