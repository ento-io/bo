import Fab from '@mui/material/Fab';
import { FiPlus } from 'react-icons/fi';

type Props = {
  onClick?: () => void;
};

const AddFab = ({ onClick }: Props) => {
  return (
    <Fab
      onClick={onClick}
      color="primary"
      aria-label="add"
      css={{ margin: 0, top: 'auto', right: 30, bottom: 30, left: 'auto', position: 'fixed' }}>
      <FiPlus size={26} />
    </Fab>
  );
};

export default AddFab;
