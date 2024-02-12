import { Card, CardContent, IconButton, Typography } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "@tanstack/react-router";
import { getArticleArticleSelector } from "@/redux/reducers/article.reducer";
import { articleRoute } from "@/routes/protected/article.routes";
import { deleteArticle, goToArticles } from "@/redux/actions/article.action";

const Article = () => {
  const params = articleRoute.useParams();
  const article = useSelector(getArticleArticleSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!article) return null;

  const handleDelete = async (id: string) => {
    await dispatch(deleteArticle(id));
    navigate(goToArticles())
  }

  return (
    <div className="flexColumn">
      <Card>
        <CardContent>
          <Typography>Title: {article.title}</Typography>
        </CardContent>
      </Card>
      <IconButton color="error" onClick={() => handleDelete(params.id)}>
        <FiTrash2 />
      </IconButton>
    </div>
  )
}

export default Article