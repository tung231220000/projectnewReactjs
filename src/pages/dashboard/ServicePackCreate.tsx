import { capitalCase, paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import ServicePackNewEditForm from 'src/sections/@dashboard/service-pack/ServicePackNewEditForm';
import useServicePack from 'src/hooks/useServicePack';
import useSettings from '../../hooks/useSettings';

// ----------------------------------------------------------------------

export default function ServicePackCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { themeStretch } = useSettings();
  const { servicePacks } = useServicePack();

  const isEdit = pathname.includes('edit');
  const currentServicePack = servicePacks.find((servicePack) => paramCase(servicePack._id) === _id);

  return (
    <Page
      title={
        !isEdit ? 'Service Pack: Create a new service pack' : 'Service Pack: Edit a service pack'
      }
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new service pack' : 'Edit Service Pack'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Service Pack', href: PATH_DASHBOARD.servicePack.list },
            { name: !isEdit ? 'New Service Pack' : capitalCase(_id) },
          ]}
        />

        <ServicePackNewEditForm isEdit={isEdit} currentServicePack={currentServicePack} />
      </Container>
    </Page>
  );
}
