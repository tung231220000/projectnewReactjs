import { capitalCase, paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';

import CategoryNewEditForm from 'src/sections/@dashboard/category/CategoryNewEditForm';
import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import useCategory from 'src/hooks/useCategory';
import useSettings from '../../hooks/useSettings';

// ----------------------------------------------------------------------

export default function CategoryCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { themeStretch } = useSettings();
  const { categories } = useCategory();

  const isEdit = pathname.includes('edit');
  const currentCategory = categories.find((category) => paramCase(category._id) === _id);

  return (
    <Page title={!isEdit ? 'Category: Create a new category' : 'Category: Edit a category'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new category' : 'Edit Category'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Category', href: PATH_DASHBOARD.category.list },
            { name: !isEdit ? 'New Category' : capitalCase(_id) },
          ]}
        />

        <CategoryNewEditForm isEdit={isEdit} currentCategory={currentCategory} />
      </Container>
    </Page>
  );
}
