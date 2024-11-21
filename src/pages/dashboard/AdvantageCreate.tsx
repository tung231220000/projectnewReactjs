import { capitalCase, paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';

import AdvantageNewEditForm from 'src/sections/@dashboard/advantage/AdvantageNewEditForm';
import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import useAdvantage from 'src/hooks/useAdvantage';
import useSettings from '../../hooks/useSettings';

// ----------------------------------------------------------------------

export default function CategoryCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { themeStretch } = useSettings();
  const { advantages } = useAdvantage();

  const isEdit = pathname.includes('edit');
  const currentAdvantage = advantages.find((advantage) => paramCase(advantage._id) === _id);

  return (
    <Page title={!isEdit ? 'Advantage: Create a new advantage' : 'Advantage: Edit a advantage'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new advantage' : 'Edit Advantage'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Advantage', href: PATH_DASHBOARD.advantage.list },
            { name: !isEdit ? 'New Advantage' : capitalCase(_id) },
          ]}
        />

        <AdvantageNewEditForm isEdit={isEdit} currentAdvantage={currentAdvantage} />
      </Container>
    </Page>
  );
}
