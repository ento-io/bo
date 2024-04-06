import { useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ArticleForm from "../../containers/articles/ArticleForm";
import { createArticle, goToArticle } from "@/redux/actions/article.action";
import { getArticleArticleSelector } from "@/redux/reducers/article.reducer";
import { IArticleInput } from "@/types/article.types";

const CreateArticle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const newArticle = useSelector(getArticleArticleSelector);

  useEffect(() => {
    if (!newArticle) return;
    navigate(goToArticle(newArticle.objectId));
  }, [newArticle, navigate]);

  const handleSubmitArticle = (values: IArticleInput) => {
    dispatch(createArticle(values));
  }

  return (
    <div className="flexColumn">
      <h1>CreateArticle</h1>
      <ArticleForm
        onSubmit={handleSubmitArticle}
      />
    </div>
  )
}

export default CreateArticle