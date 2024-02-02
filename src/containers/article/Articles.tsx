import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiPlus , FiEdit2 , FiTrash2 , FiEye } from "react-icons/fi";

import { Fab, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteArticle, getArticles } from '@/actions/articles.action';
// import Notification from '@/components/Notification';
import { IArticle } from '@/types/article.types';
import { getUserFullName } from '@/utils/utils';

const Articles = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // load initial article list
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const articles = await getArticles();
        setArticles(articles as IArticle[]);
        setLoading(false);
      } catch (error) {
        setError(error as string);
      }
    }
  
    init();
  }, [setArticles])

  const handleDeleteArticle = async (id: string) => {
    try {
      setLoading(true);
      const deletedArticle = await deleteArticle(id);
      const newArticles = articles.filter((article: IArticle) => article.id !== deletedArticle?.id);
      setArticles(newArticles);
      setLoading(false);
    } catch (error) {
      setError(error as string);
    }
  }

  const handleEdit = (id: string) => {
    navigate(`/articles/edit/${  id}`);
  }

  const handleAddArticle = () => {
    navigate("/articles/create");
  }

  const handlePreview = (id: string) => {
    navigate(`/articles/${  id}`);
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Title</TableCell>
              <TableCell align="right">Author</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article: IArticle, index: number) => (
              <TableRow
                key={article.id + index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {article.id}
                </TableCell>
                <TableCell align="right">{article.get('title')}</TableCell>
                <TableCell component="th" scope="row">
                  {article.has("author") ? getUserFullName(article.get("author")) : "-"}
                </TableCell>
                <TableCell align="right">
                  <IconButton color="info" onClick={() => handlePreview(article.id)}>
                    <FiEye />
                  </IconButton>
                  <IconButton color="info" onClick={() => handleEdit(article.id)}>
                    <FiEdit2 />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteArticle(article.id)}>
                    <FiTrash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Notification message={error} show={!!error} severity="error" /> */}
      <Fab color="primary" aria-label="add" onClick={handleAddArticle}>
        <FiPlus />
      </Fab>
    </div>
  );
}

export default Articles;
