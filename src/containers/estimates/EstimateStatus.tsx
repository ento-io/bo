import { Chip } from "@mui/material";
import { EstimateStatusEnum, IEstimate } from "@/types/estimate.type";
import { getEstimateStatusLabel } from "@/utils/estimate.utils";

const getColor = (status: IEstimate['status']) => {
  switch (status) {
    case EstimateStatusEnum.WAITING:
      return 'error';
    case EstimateStatusEnum.DONE:
      return 'success';
    default:
      return 'default';
  }
}

type Props = {
  status: IEstimate['status'];
}

const EstimateStatus = ({ status }: Props) => {
  return (
    <Chip
      label={getEstimateStatusLabel(status)}
      color={getColor(status)}
    />
  );
}

export default EstimateStatus;