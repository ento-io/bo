import Parse, { Attributes } from 'parse';

import { actionWithLoader } from '@/utils/app.utils';

import { AppDispatch, AppThunkAction } from '@/redux/store';

import { PATH_NAMES } from '@/utils/pathnames';
import { addArticleToArticlesSlice, deleteArticleFromArticlesSlice, loadArticleSlice, loadArticlesSlice, setArticlesCountSlice } from '../reducers/article.reducer';
import { setMessageSlice } from '../reducers/app.reducer';


const Article = Parse.Object.extend("Article");

export const getArticle = async (id: string): Promise<Parse.Object | undefined> => {
  const article = await new Parse.Query(Article)
    .equalTo('objectId', id)
    .notEqualTo('deleted', true)
    .include(["comments"])
    .first();

  if (!article) {
    throw new Error("Article not found");
  }
  return article;
}

// ----------------------------------------------------- //
// ------------------- Redux Actions ------------------- //
// ----------------------------------------------------- //

export const loadArticles = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    // user from BO
    const result = await new Parse.Query(Article)
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

export const createArticle = (values: any): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const user = await Parse.User.currentAsync();
    const article = new Article()

    article.set("title", values.title)
    article.set("author", user)

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const savedArticle = await article.save();
    dispatch(addArticleToArticlesSlice((savedArticle as Attributes).toJSON()));
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

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToArticles = () => ({ to: PATH_NAMES.articles });
export const goToArticle = (id: string) => ({ to: PATH_NAMES.articles + '/$id', params: { id }});
