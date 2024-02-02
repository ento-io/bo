import Parse from "parse";

const Comment = Parse.Object.extend("Comment");

export const createCommentByArticle = async (value: string): Promise<Parse.Object[]> => {
  try {
    const comment = new Comment();
    // comment.set('article', article);
    comment.set('content', value);
    const newComment = await comment.save();

    return newComment;
  } catch (error) {
    console.log('error: ', error);

    return Promise.reject(error);
  }
}

