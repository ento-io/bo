import { Card, CardContent, CardHeader } from "@mui/material"
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  rootClassName?: string;
  rightHeader?: ReactNode;
}
const CardFormBlock = ({ title, description, children, className, rootClassName, rightHeader }: Props) => {
  return (
    <Card css={{ overflow: 'initial' }} className={rootClassName}>
      <CardHeader
        action={rightHeader}
        title={title}
        subheader={description}
        css={{
          paddingTop: description ? 8 : 18,
          paddingBottom: description ? 8 : 18,
          borderBottom: title || description ? '1px solid #e0e0e0' : 'none',
          '& .MuiCardHeader-action': {
            alignSelf: 'stretch',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          '& .MuiCardHeader-title': {
            fontSize: 16,
            fontWeight: 500,
          },
          '& .MuiCardHeader-subheader': {
            fontSize: 14,
          }
        }}
      />
      {children && (
        <CardContent className={className}>
          {children}
        </CardContent>
      )}
    </Card>
  )
}

export default CardFormBlock;