import { capitalCase, paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import QaANewEditForm from 'src/sections/@dashboard/QaA/QaANewEditForm';
import useQaA from 'src/hooks/useQaA';
import useSettings from '../../hooks/useSettings';

// ----------------------------------------------------------------------

export default function QaACreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { themeStretch } = useSettings();
  const { QaAs } = useQaA();

  const isEdit = pathname.includes('edit');
  const currentQaA = QaAs.find((QaA) => paramCase(QaA._id) === _id);

  return (
    <Page title={!isEdit ? 'QaA: Create a new QaA' : 'QaA: Edit a QaA'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new QaA' : 'Edit QaA'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'QaA', href: PATH_DASHBOARD.QaA.list },
            { name: !isEdit ? 'New QaA' : capitalCase(_id) },
          ]}
        />

        <QaANewEditForm isEdit={isEdit} currentQaA={currentQaA} />
      </Container>
    </Page>
  );
}
