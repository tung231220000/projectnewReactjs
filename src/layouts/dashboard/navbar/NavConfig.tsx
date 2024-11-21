import { PATH_DASHBOARD } from '../../../routes/paths';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'DTS Telecom Admin v0.1.0',
    items: [
      { title: 'One', path: '/dashboard/one', icon: ICONS.dashboard },
      { title: 'Two', path: '/dashboard/two', icon: ICONS.ecommerce },
      { title: 'Three', path: '/dashboard/three', icon: ICONS.analytics },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // PAGE
      {
        title: 'page',
        path: PATH_DASHBOARD.page.root,
        icon: ICONS.blog,
        children: [{ title: 'Page', path: PATH_DASHBOARD.page.list }],
      },
      // INFORMATION
      {
        title: 'information',
        path: PATH_DASHBOARD.information.root,
        icon: ICONS.blog,
        children: [{ title: 'List', path: PATH_DASHBOARD.information.list }],
      },
      // BLOG
      {
        title: 'blog',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [{ title: 'posts', path: PATH_DASHBOARD.blog.posts }],
      },
      // PARTNER
      {
        title: 'partner',
        path: PATH_DASHBOARD.partner.root,
        icon: ICONS.blog,
        children: [{ title: 'List', path: PATH_DASHBOARD.partner.list }],
      },
      // TRADEMARK
      {
        title: 'trademark',
        path: PATH_DASHBOARD.trademark.root,
        icon: ICONS.blog,
        children: [{ title: 'List', path: PATH_DASHBOARD.trademark.list }],
      },
      // OFFICE
      {
        title: 'office',
        path: PATH_DASHBOARD.office.root,
        icon: ICONS.blog,
        children: [{ title: 'List', path: PATH_DASHBOARD.office.list }],
      },
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [{ title: 'List', path: PATH_DASHBOARD.user.list }],
      },
      // PRODUCT
      {
        title: 'category',
        path: PATH_DASHBOARD.category.root,
        icon: ICONS.cart,
        children: [{ title: 'List', path: PATH_DASHBOARD.category.list }],
      },
      // SOLUTION
      {
        title: 'solution-category',
        path: PATH_DASHBOARD.solutionCategory.root,
        icon: ICONS.cart,
        children: [{ title: 'List', path: PATH_DASHBOARD.solutionCategory.list }],
      },
      {
        title: 'advantage',
        path: PATH_DASHBOARD.advantage.root,
        icon: ICONS.cart,
        children: [{ title: 'List', path: PATH_DASHBOARD.advantage.list }],
      },
      {
        title: 'QaA',
        path: PATH_DASHBOARD.QaA.root,
        icon: ICONS.cart,
        children: [{ title: 'List', path: PATH_DASHBOARD.QaA.list }],
      },
      {
        title: 'price',
        path: PATH_DASHBOARD.price.root,
        icon: ICONS.cart,
        children: [{ title: 'List', path: PATH_DASHBOARD.price.list }],
      },
      {
        title: 'service-pack',
        path: PATH_DASHBOARD.servicePack.root,
        icon: ICONS.cart,
        children: [{ title: 'List', path: PATH_DASHBOARD.servicePack.list }],
      },
      {
        title: 'bonus-service',
        path: PATH_DASHBOARD.bonusService.root,
        icon: ICONS.cart,
        children: [{ title: 'List', path: PATH_DASHBOARD.bonusService.list }],
      },
      {
        title: 'product',
        path: PATH_DASHBOARD.product.root,
        icon: ICONS.cart,
        children: [{ title: 'List', path: PATH_DASHBOARD.product.list }],
      },
      {
        title: 'solution',
        path: PATH_DASHBOARD.solution.root,
        icon: ICONS.cart,
        children: [{ title: 'List', path: PATH_DASHBOARD.solution.list }],
      },
      {
        title: 'service',
        path: PATH_DASHBOARD.service.root,
        icon: ICONS.cart,
        children: [{ title: 'List', path: PATH_DASHBOARD.service.list }],
      },
    ],
  },
];

export default navConfig;
