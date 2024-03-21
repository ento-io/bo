import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FiTrash2 } from 'react-icons/fi';
import { IconButton } from '@mui/material';
import Head from '@/components/Head';
import { getEstimateEstimatesSelector } from '@/redux/reducers/estimate.reducer';
import { IEstimate } from '@/types/estimate.type';
import { deleteEstimate, goToEstimates } from '@/redux/actions/estimate.action';

const Estimates = () => {
  const estimates = useSelector(getEstimateEstimatesSelector);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleDelete = async (id: string) => {
    await dispatch(deleteEstimate(id));
  }
  return (
    <div>
      <Head title={t('articles')} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Title</TableCell>
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
                  <IconButton color="error" onClick={() => handleDelete(estimate.objectId)}>
                    <FiTrash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Estimates;
