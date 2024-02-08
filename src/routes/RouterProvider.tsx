import { RouterProvider as TanstackRouterProvider } from '@tanstack/react-router';
import router from './routes';
import { Store } from '@/redux/store';

type Props = {
  store: Store
}
const RouterProvider = ({ store }: Props) => {
  return (
    <TanstackRouterProvider router={router} context={{ store }} />
  )
}

export default RouterProvider
