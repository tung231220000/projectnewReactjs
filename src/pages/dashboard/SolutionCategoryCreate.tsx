import { capitalCase, paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import SolutionCategoryNewEditForm from 'src/sections/@dashboard/solution-category/SolutionCategoryNewEditForm';
import useSettings from '../../hooks/useSettings';
import useSolutionCategory from 'src/hooks/useSolutionCategory';

// ----------------------------------------------------------------------

export default function SolutionCategoryCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { themeStretch } = useSettings();
  const { solutionCategories } = useSolutionCategory();

  const isEdit = pathname.includes('edit');
  const currentSolutionCategory = solutionCategories.find(
    (category) => paramCase(category._id) === _id
  );

  return (
    <Page
      title={
        !isEdit
          ? 'Solution Category: Create a new solution category'
          : 'Solution Category: Edit a solution category'
      }
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new solution category' : 'Edit solution category'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Solution Category', href: PATH_DASHBOARD.solutionCategory.list },
            { name: !isEdit ? 'New Solution Category' : capitalCase(_id) },
          ]}
        />

        <SolutionCategoryNewEditForm
          isEdit={isEdit}
          currentSolutionCategory={currentSolutionCategory}
        />
      </Container>
    </Page>
  );
}
