import React, {ElementType, Suspense, lazy} from 'react';
import {Navigate, useLocation, useRoutes} from 'react-router-dom';
import useAuth from "@/hooks/useAuth";
import LoadingScreen from "@/components/LoadingScreen";
import GuestGuard from "@/guards/GuestGuard";
import AuthGuard from "@/guards/AuthGuard";
import DashboardLayout from "@/layouts/dashboard";
import LogoOnlyLayout from "@/layouts/LogoOnlyLayout";


// ----------------------------------------------------------------------

const Loadable = <P extends Record<string, unknown>>(Component: ElementType) => (props: P) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {pathname} = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {isAuthenticated} = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard}/>}>
      <Component {...props} />
    </Suspense>
  );
};


export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [{ element: <Navigate to="/auth/login" replace />, index: true }],
    },
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        // { path: 'reset-password', element: <ResetPassword /> },
        // { path: 'new-password', element: <NewPassword /> },
        // { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/one" replace />, index: true },
        { path: 'one', element: <PageOne /> },
        {
          path: 'page',
          children: [
            { element: <Navigate to="/dashboard/page/list" replace />, index: true },
            { path: 'list', element: <PageList /> },
            { path: ':name/edit', element: <PageEdit /> },
          ],
        },
        {
          path: 'information',
          children: [
            { element: <Navigate to="/dashboard/information/list" replace />, index: true },
            { path: 'list', element: <InformationList /> },
            { path: ':_id/edit', element: <InformationCreate /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPosts /> },
            { path: 'post/:_id', element: <BlogPost /> },
            { path: 'new', element: <BlogNewPost /> },
            { path: ':_id/edit', element: <BlogNewPost /> },
          ],
        },
        {
          path: 'partner',
          children: [
            { element: <Navigate to="/dashboard/partner/list" replace />, index: true },
            { path: 'list', element: <PartnerList /> },
            { path: 'new', element: <PartnerCreate /> },
            { path: ':_id/edit', element: <PartnerCreate /> },
          ],
        },
        {
          path: 'trademark',
          children: [
            { element: <Navigate to="/dashboard/trademark/list" replace />, index: true },
            { path: 'list', element: <TrademarkList /> },
            { path: 'new', element: <TrademarkCreate /> },
            { path: ':_id/edit', element: <TrademarkCreate /> },
          ],
        },
        {
          path: 'office',
          children: [
            { element: <Navigate to="/dashboard/office/list" replace />, index: true },
            { path: 'list', element: <OfficeList /> },
            { path: 'new', element: <OfficeCreate /> },
            { path: ':_id/edit', element: <OfficeCreate /> },
          ],
        },
        {
          path: 'user',
          children: [
            {
              element: <Navigate to="/user/list" replace />,
              index: true,
            },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
          ],
        },
        {
          path: 'category',
          children: [
            {
              element: <Navigate to="/category/list" replace />,
              index: true,
            },
            { path: 'list', element: <CategoryList /> },
            { path: 'new', element: <CategoryCreate /> },
            { path: ':_id/edit', element: <CategoryCreate /> },
          ],
        },
        {
          path: 'solution-category',
          children: [
            {
              element: <Navigate to="/solution-category/list" replace />,
              index: true,
            },
            { path: 'list', element: <SolutionCategoryList /> },
            { path: 'new', element: <SolutionCategoryCreate /> },
            { path: ':_id/edit', element: <SolutionCategoryCreate /> },
          ],
        },
        {
          path: 'advantage',
          children: [
            {
              element: <Navigate to="/advantage/list" replace />,
              index: true,
            },
            { path: 'list', element: <AdvantageList /> },
            { path: 'new', element: <AdvantageCreate /> },
            { path: ':_id/edit', element: <AdvantageCreate /> },
          ],
        },
        {
          path: 'QaA',
          children: [
            {
              element: <Navigate to="/QaA/list" replace />,
              index: true,
            },
            { path: 'list', element: <QaAList /> },
            { path: 'new', element: <QaACreate /> },
            { path: ':_id/edit', element: <QaACreate /> },
          ],
        },
        {
          path: 'price',
          children: [
            {
              element: <Navigate to="/price/list" replace />,
              index: true,
            },
            { path: 'list', element: <PriceList /> },
            { path: 'new', element: <PriceCreate /> },
            { path: ':_id/edit', element: <PriceCreate /> },
          ],
        },
        {
          path: 'service-pack',
          children: [
            {
              element: <Navigate to="/service-pack/list" replace />,
              index: true,
            },
            { path: 'list', element: <ServicePackList /> },
            { path: 'new', element: <ServicePackCreate /> },
            { path: ':_id/edit', element: <ServicePackCreate /> },
          ],
        },
        {
          path: 'bonus-service',
          children: [
            {
              element: <Navigate to="/bonus-service/list" replace />,
              index: true,
            },
            { path: 'list', element: <BonusServiceList /> },
            { path: 'new', element: <BonusServiceCreate /> },
            { path: ':_id/edit', element: <BonusServiceCreate /> },
          ],
        },
        {
          path: 'product',
          children: [
            {
              element: <Navigate to="/product/list" replace />,
              index: true,
            },
            { path: 'list', element: <ProductList /> },
            { path: 'new', element: <ProductCreate /> },
            { path: ':key/edit', element: <ProductCreate /> },
          ],
        },
        {
          path: 'solution',
          children: [
            {
              element: <Navigate to="/solution/list" replace />,
              index: true,
            },
            { path: 'list', element: <SolutionList /> },
            { path: 'new', element: <SolutionCreate /> },
            { path: ':key/edit', element: <SolutionCreate /> },
          ],
        },
        {
          path: 'service',
          children: [
            {
              element: <Navigate to="/service/list" replace />,
              index: true,
            },
            { path: 'list', element: <ServiceList /> },
            { path: 'new', element: <ServiceCreate /> },
            { path: ':_id/edit', element: <ServiceCreate /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        // { path: 'coming-soon', element: <ComingSoon /> },
        // { path: 'maintenance', element: <Maintenance /> },
        // { path: 'pricing', element: <Pricing /> },
        // { path: 'payment', element: <Payment /> },
        // { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        // { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));

// Dashboard
const PageOne = Loadable(lazy(() => import('../pages/PageOne')));
const PageList = Loadable(lazy(() => import('../pages/dashboard/PageList')));
const PageEdit = Loadable(lazy(() => import('../pages/dashboard/PageEdit')));
const InformationList = Loadable(lazy(() => import('../pages/dashboard/InformationList')));
const InformationCreate = Loadable(lazy(() => import('../pages/dashboard/InformationCreate')));
const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
const PartnerList = Loadable(lazy(() => import('../pages/dashboard/PartnerList')));
const PartnerCreate = Loadable(lazy(() => import('../pages/dashboard/PartnerCreate')));
const TrademarkList = Loadable(lazy(() => import('../pages/dashboard/TrademarkList')));
const TrademarkCreate = Loadable(lazy(() => import('../pages/dashboard/TrademarkCreate')));
const OfficeList = Loadable(lazy(() => import('../pages/dashboard/OfficeList')));
const OfficeCreate = Loadable(lazy(() => import('../pages/dashboard/OfficeCreate')));
const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));
const CategoryList = Loadable(lazy(() => import('../pages/dashboard/CategoryList')));
const CategoryCreate = Loadable(lazy(() => import('../pages/dashboard/CategoryCreate')));
const SolutionCategoryList = Loadable(
  lazy(() => import('../pages/dashboard/SolutionCategoryList'))
);
const SolutionCategoryCreate = Loadable(
  lazy(() => import('../pages/dashboard/SolutionCategoryCreate'))
);
const AdvantageList = Loadable(lazy(() => import('../pages/dashboard/AdvantageList')));
const AdvantageCreate = Loadable(lazy(() => import('../pages/dashboard/AdvantageCreate')));
const QaAList = Loadable(lazy(() => import('../pages/dashboard/QaAList')));
const QaACreate = Loadable(lazy(() => import('../pages/dashboard/QaACreate')));
const PriceList = Loadable(lazy(() => import('../pages/dashboard/PriceList')));
const PriceCreate = Loadable(lazy(() => import('../pages/dashboard/PriceCreate')));
const ServicePackList = Loadable(lazy(() => import('../pages/dashboard/ServicePackList')));
const ServicePackCreate = Loadable(lazy(() => import('../pages/dashboard/ServicePackCreate')));
const BonusServiceList = Loadable(lazy(() => import('../pages/dashboard/BonusServiceList')));
const BonusServiceCreate = Loadable(lazy(() => import('../pages/dashboard/BonusServiceCreate')));
const ProductList = Loadable(lazy(() => import('../pages/dashboard/ProductList')));
const ProductCreate = Loadable(lazy(() => import('../pages/dashboard/ProductCreate')));
const SolutionList = Loadable(lazy(() => import('../pages/dashboard/SolutionList')));
const SolutionCreate = Loadable(lazy(() => import('../pages/dashboard/SolutionCreate')));
const ServiceList = Loadable(lazy(() => import('../pages/dashboard/ServiceList')));
const ServiceCreate = Loadable(lazy(() => import('../pages/dashboard/ServiceCreate')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
