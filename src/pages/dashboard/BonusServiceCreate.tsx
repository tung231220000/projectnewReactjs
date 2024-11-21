import { capitalCase, paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';

import BonusServiceNewEditForm from 'src/sections/@dashboard/bonus-service/BonusServiceNewEditForm';
import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import useBonusService from 'src/hooks/useBonusService';
import useSettings from '../../hooks/useSettings';

// ----------------------------------------------------------------------

export default function BonusServiceCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { themeStretch } = useSettings();
  const { bonusServices } = useBonusService();

  const isEdit = pathname.includes('edit');
  const currentBonusService = bonusServices.find((service) => paramCase(service._id) === _id);

  return (
    <Page
      title={
        !isEdit
          ? 'Bonus Service: Create a new bonus service'
          : 'Bonus Service: Edit a bonus service'
      }
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new bonus service' : 'Edit Bonus Service'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Bonus Service', href: PATH_DASHBOARD.bonusService.list },
            { name: !isEdit ? 'New Bonus Service' : capitalCase(_id) },
          ]}
        />

        <BonusServiceNewEditForm isEdit={isEdit} currentBonusService={currentBonusService} />
      </Container>
    </Page>
  );
}
