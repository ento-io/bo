import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiPlus, FiTrash2 , FiEye } from "react-icons/fi";

import { Fab, IconButton } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Head from '@/components/Head';
import { getEstimateEstimatesSelector } from '@/redux/reducers/estimate.reducer';
import { IEstimate } from '@/types/estimate.type';
import { loadEstimates, onEstimatesEnter } from '@/redux/actions/estimate.action';

const Estimates = () => {
  const estimates = useSelector(getEstimateEstimatesSelector);

  // const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // const handleAddEstimate = async () => {
  //   const values = { title: `Article ${uid}` };
  //   dispatch(createEstimate(values));

  // }
  const getEstimate = async () => {
    // const values = { url: `Estimate ${uid}` };
    dispatch(loadEstimates());

  }

  // const handleDelete = (id: string) => {
  //   dispatch(deleteArticle(id));
  // }

  // const handlePreview = (id: string) => {
  //   navigate(goToArticle(id));
  // }

  return (
    <div>
      <Head title={t('articles')} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Title</TableCell>
              {/* <TableCell align="right">Author</TableCell> */}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estimates.map((estimate: IEstimate, index: number) => (
              <TableRow
                key={estimate.objectId + index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {estimate.objectId}
                </TableCell>
                <TableCell component="th" scope="row">
                  {estimate.url}
                </TableCell>
                <TableCell align="right">
                  {/* <IconButton color="info" onClick={() => handlePreview(article.objectId)}>
                    <FiEye />
                  </IconButton> */}
                  {/* <IconButton color="info" onClick={() => handleEdit(article.id)}>
                    <FiEdit2 />
                  </IconButton> */}
                  {/* <IconButton color="error" onClick={() => handleDelete(article.objectId)}>
                    <FiTrash2 />
                  </IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Notification message={error} show={!!error} severity="error" /> */}
      {/* <Fab color="primary" aria-label="add" onClick={handleAdd}>
        <FiPlus />
      </Fab> */}
    </div>
  );
}

export default Estimates;
