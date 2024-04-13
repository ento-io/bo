import { Card, CardContent, CardHeader } from "@mui/material"
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;

}
const CardFormBlock = ({ title, description, children, className }: Props) => {
  return (
    <Card>
      <CardHeader
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={title}
        subheader={description}
        css={{
          paddingTop: description ? 8 : 18,
          paddingBottom: description ? 8 : 18,
          borderBottom: title || description ? '1px solid #e0e0e0' : 'none',
          '& .MuiCardHeader-title': {
            fontSize: 16,
            fontWeight: 500,
          },
          '& .MuiCardHeader-subheader': {
            fontSize: 14,
          }
        }}
      />
      <CardContent className={className}>
        {children}
      </CardContent>
    </Card>
  )
}

export default CardFormBlock;