import { useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import ArticleForm from "@/containers/articles/ArticleForm";
import { editArticle, goToArticle } from "@/redux/actions/article.action";
import { getArticleArticleSelector } from "@/redux/reducers/article.reducer";
import { editArticleRoute } from "@/routes/protected/article.routes";
import { IArticleInput } from "@/types/article.types";

const EditArticle = () => {
  const params = editArticleRoute.useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const article = useSelector(getArticleArticleSelector);

  const handleSubmitArticle = async (values: IArticleInput) => {
    if (!article) return;
    await dispatch(editArticle(article.objectId, values));
    navigate(goToArticle(article.objectId));
  }

  return (
    <div className="flexColumn">
      <h1>EditArticle: {params?.id}</h1>
      <ArticleForm
        onSubmit={handleSubmitArticle}
        article={article}
      />
    </div>
  )
}

export default EditArticle