import { Grid } from "@mui/material";
import Layout from "@/components/layouts/Layout";
import { PREVIEW_PAGE_GRID } from "@/utils/constants";
import UserInfo from "./UserInfos";
import { ISelectOption } from "@/types/app.type";

type Props<T extends object, K extends ISelectOption<(keyof T)>[]> = {
  // type Props<T extends object, K extends (keyof T)[]> = {
  object: T;
  keys: K
};
const UsersForEntity = <T extends object, K extends ISelectOption<(keyof T)>[]>({ object, keys }: Props<T, K>) => {
  return (
    <Grid item {...PREVIEW_PAGE_GRID.left}>
      <Grid container gap={2}>
        {keys.map((key) => {
          const user = object[key.value] as any;
          if (!user) return null;
          return (
            <Grid item lg={3} key={key.value as string}>
              <Layout cardTitle={key.label as string}>
                <UserInfo user={user} direction="row" />
              </Layout>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}

export default UsersForEntity;