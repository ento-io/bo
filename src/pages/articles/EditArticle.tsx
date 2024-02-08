import { useEffect, useState } from "react";

import { LinearProgress } from "@mui/material";

import ArticleForm from "./ArticleForm";
import { editArticle, getArticle } from "@/actions/articles.action";
import { IArticle, IArticleInput } from "@/types/article.types";
import { EditArticleRoute } from "@/routes/protected/article.routes";
import { useNavigate } from "@tanstack/react-router";
// import Notification from "@/components/Notification";

const EditArticle = () => {
  const [article, setArticle] = useState<IArticle | null>(null)
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { id } = EditArticleRoute.useParams();
  const navigate = useNavigate();

  // load initial article list
  useEffect(() => {
    if (!id) return;
    const init = async () => {
      try {
        setLoading(true);
        const article = await getArticle(id);
        setArticle(article as IArticle);
        setLoading(false);
      } catch (error) {
        setError(error as string);
      }
    }
    
    init();
  }, [id])

  const handleSubmitArticle = async (values: IArticleInput) => {
    if (!id) return;
    setLoading(true);
    try {
      // -------- creation -------- //
      const updatedArticle = await editArticle(id, values);
      navigate({ to: '/articles/$id', params: { id: updatedArticle?.id }});
      // navigate("/articles/" + updatedArticle.id);
      setLoading(false);
    } catch (error) {
      setError(error as string);
      setLoading(false);
    }
  }


  return (
    <div css={{ minHeight: "100vh", position: "relative" }} className="flexColumn">
      {loading && <LinearProgress css={{ height: 4, position: "absolute", top: 0, left: 0, right: 0 }} className="stretchSelf" />}
      <h1>EditArticle</h1>
      <ArticleForm
        onSubmit={handleSubmitArticle}
        loading={loading}
        article={article}
      />
      {/* <Notification message={error} show={!!error} severity="error" /> */}
    </div>
  )
}

export default EditArticle