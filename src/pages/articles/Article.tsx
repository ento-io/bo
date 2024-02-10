import { useEffect, useState } from "react";

import { Card, CardContent, LinearProgress, Typography } from "@mui/material";

import { getArticle } from "@/actions/articles.action";
import { IArticle } from "@/types/article.types";
import { articleRoute } from '@/routes/protected/article.routes';

const Article = () => {
  const [article, setArticle] = useState<IArticle | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { id } = articleRoute.useParams();
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