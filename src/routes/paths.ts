// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  page: {
    root: path(ROOTS_DASHBOARD, '/page'),
    list: path(ROOTS_DASHBOARD, '/page/list'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/page/${name}/edit`),
  },
  information: {
    root: path(ROOTS_DASHBOARD, '/information'),
    list: path(ROOTS_DASHBOARD, '/information/list'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/information/${_id}/edit`),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (_id: string) => path(ROOTS_DASHBOARD, `/blog/post/${_id}`),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/blog/${_id}/edit`),
  },
  partner: {
    root: path(ROOTS_DASHBOARD, '/partner'),
    list: path(ROOTS_DASHBOARD, '/partner/list'),
    new: path(ROOTS_DASHBOARD, '/partner/new'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/partner/${_id}/edit`),
  },
  trademark: {
    root: path(ROOTS_DASHBOARD, '/trademark'),
    list: path(ROOTS_DASHBOARD, '/trademark/list'),
    new: path(ROOTS_DASHBOARD, '/trademark/new'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/trademark/${_id}/edit`),
  },
  office: {
    root: path(ROOTS_DASHBOARD, '/office'),
    list: path(ROOTS_DASHBOARD, '/office/list'),
    new: path(ROOTS_DASHBOARD, '/office/new'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/office/${_id}/edit`),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
  },
  category: {
    root: path(ROOTS_DASHBOARD, '/category'),
    new: path(ROOTS_DASHBOARD, '/category/new'),
    list: path(ROOTS_DASHBOARD, '/category/list'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/category/${_id}/edit`),
  },
  solutionCategory: {
    root: path(ROOTS_DASHBOARD, '/solution-category'),
    new: path(ROOTS_DASHBOARD, '/solution-category/new'),
    list: path(ROOTS_DASHBOARD, '/solution-category/list'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/solution-category/${_id}/edit`),
  },
  advantage: {
    root: path(ROOTS_DASHBOARD, '/advantage'),
    new: path(ROOTS_DASHBOARD, '/advantage/new'),
    list: path(ROOTS_DASHBOARD, '/advantage/list'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/advantage/${_id}/edit`),
  },
  QaA: {
    root: path(ROOTS_DASHBOARD, '/QaA'),
    new: path(ROOTS_DASHBOARD, '/QaA/new'),
    list: path(ROOTS_DASHBOARD, '/QaA/list'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/QaA/${_id}/edit`),
  },
  price: {
    root: path(ROOTS_DASHBOARD, '/price'),
    new: path(ROOTS_DASHBOARD, '/price/new'),
    list: path(ROOTS_DASHBOARD, '/price/list'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/price/${_id}/edit`),
  },
  servicePack: {
    root: path(ROOTS_DASHBOARD, '/service-pack'),
    new: path(ROOTS_DASHBOARD, '/service-pack/new'),
    list: path(ROOTS_DASHBOARD, '/service-pack/list'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/service-pack/${_id}/edit`),
  },
  bonusService: {
    root: path(ROOTS_DASHBOARD, '/bonus-service'),
    new: path(ROOTS_DASHBOARD, '/bonus-service/new'),
    list: path(ROOTS_DASHBOARD, '/bonus-service/list'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/bonus-service/${_id}/edit`),
  },
  product: {
    root: path(ROOTS_DASHBOARD, '/product'),
    new: path(ROOTS_DASHBOARD, '/product/new'),
    list: path(ROOTS_DASHBOARD, '/product/list'),
    edit: (key: string) => path(ROOTS_DASHBOARD, `/product/${key}/edit`),
  },
  solution: {
    root: path(ROOTS_DASHBOARD, '/solution'),
    new: path(ROOTS_DASHBOARD, '/solution/new'),
    list: path(ROOTS_DASHBOARD, '/solution/list'),
    edit: (key: string) => path(ROOTS_DASHBOARD, `/solution/${key}/edit`),
  },
  service: {
    root: path(ROOTS_DASHBOARD, '/service'),
    new: path(ROOTS_DASHBOARD, '/service/new'),
    list: path(ROOTS_DASHBOARD, '/service/list'),
    edit: (_id: string) => path(ROOTS_DASHBOARD, `/service/${_id}/edit`),
  },
};
