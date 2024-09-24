import { lazy, Suspense } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const ThongkePage = lazy(() => import('src/pages/thongke'));
export const ProfilePage = lazy(() => import('src/pages/profile'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true ,  path: '',},
        { element: <UserPage />, path: '/device/home/', },
        { element: <ThongkePage />, path: '/thongke/', },
        { element: <ProfilePage />, path: '/profile/', },


      ],
    },
  ]);

  return routes;
}
