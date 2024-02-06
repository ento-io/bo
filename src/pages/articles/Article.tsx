import { useEffect, useState } from "react";

import { Card, CardContent, LinearProgress, Typography } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";

import { getArticle } from "@/actions/articles.action";
import { IArticle } from "@/types/article.types";
import { ArticleRoute } from '@/routes/protected/article.routes';
import { useNavigate } from "@tanstack/react-router";

const Article = () => {
  const [article, setArticle] = useState<IArticle | null>(null)
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { id } = ArticleRoute.useParams();
  // const navigate = useNavigate();

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



  return (
    <div css={{ minHeight: "100vh", position: "relative" }} className="flexColumn">
      {loading && <LinearProgress css={{ height: 4, position: "absolute", top: 0, left: 0, right: 0 }} className="stretchSelf" />}
      <Card>
        <CardContent>
          <Typography>Title: {article?.get('title')}</Typography>
          <Typography>Content: {article?.get('content')}</Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default Article