import Parse from "parse";

import { IArticleInput } from "@/types/article.types";
import { setValues } from "@/utils/parse.utils";

const ARTICLE_PROPERTIES = new Set(['title', 'content']);

const Article = Parse.Object.extend("Article");

export const getArticles = async (): Promise<Parse.Object[]> => {
  try {
    const articles = await new Parse.Query(Article).include("author").find();

    return articles;
  } catch (error) {
    console.log('error: ', error);

    return Promise.reject(error);
  }
}

export const getArticle = async (id: string): Promise<Parse.Object | undefined> => {
  try {
    const article = await new Parse.Query(Article)
      .equalTo('objectId', id)
      .include(["comments"])
      .first();

    if (!article) {
      throw new Error("Article not found");
    }
  
    return article
  } catch (error) {
    console.log('error: ', error);

    return Promise.reject(error);
  }
}

export const createArticle = async (values: IArticleInput): Promise<Parse.Object> => {
  try {
    const article = new Article();
    setValues(article, values, ARTICLE_PROPERTIES);

    const savedArticle = await article.save(null, { context: { name: "hello" } });

    return savedArticle
  } catch (error) {
    console.log('error: ', error);


    return Promise.reject(error);
  }
}

export const editArticle = async (id: string, values: IArticleInput): Promise<Parse.Object | undefined> => {
  try {
    const article = await getArticle(id);

    if (!article) {
      throw new Error("Article not found");
    }
    
    article.set('title', values.title);
    article.set('content', values.content);
    const updatedArticle = await article.save();
    console.log('updatedArticle: ', updatedArticle);
    return updatedArticle
  } catch (error) {
    console.log('error: ', error);
    return Promise.reject(error);
  }
}


export const deleteArticle = async (id: string): Promise<Parse.Object | undefined> => {
  try {
    const article = await getArticle(id);

    if (!article) { 
      throw new Error("Article not found");
    }
    const deletedArticle = await article.destroy();
    console.log('deletedArticle: ', deletedArticle);
    return deletedArticle;
  } catch (error) {
    console.log('error: ', error);

    return Promise.reject(error);
  }
}
