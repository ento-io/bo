import { useState } from "react";

import { LinearProgress } from "@mui/material";
// import { useNavigate } from "react-router-dom";

import { useNavigate } from "@tanstack/react-router";
import ArticleForm from "./ArticleForm";
import { createArticle } from "@/actions/articles.action";
import { IArticleInput } from "@/types/article.types";
// import Notification from "@/components/Notification";

const CreateArticle = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmitArticle = async (values: IArticleInput) => {
    setLoading(true);
    try {
      // -------- creation -------- //
      await createArticle(values);
      navigate({ to: '/articles' });
      setLoading(false);
    } catch (error) {
      setError(error as string);
      setLoading(false);
    }
  }


  return (
    <div css={{ minHeight: "100vh", position: "relative" }} className="flexColumn">
      {loading && <LinearProgress css={{ height: 4, position: "absolute", top: 0, left: 0, right: 0 }} className="stretchSelf" />}
      <h1>CreateArticle</h1>
      <ArticleForm
        onSubmit={handleSubmitArticle}
        loading={loading}
      />
      {/* <Notification message={error} show={!!error} severity="error" /> */}
    </div>
  )
}

export default CreateArticle