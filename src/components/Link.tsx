import MuiLink, { LinkProps } from '@mui/material/Link';

import { AnyRoute, LinkOptions, RegisteredRouter, Link as RouterLink } from '@tanstack/react-router';

type LinkRouterProps<TRouteTree extends AnyRoute = RegisteredRouter['routeTree'], TTo extends string = ''> =
LinkOptions<TRouteTree, '/', TTo> & LinkProps;

const Link = <TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],TTo extends string = ''>(props:LinkRouterProps<TRouteTree, TTo>) => <MuiLink {...props} component={RouterLink as any} />;

export default Link