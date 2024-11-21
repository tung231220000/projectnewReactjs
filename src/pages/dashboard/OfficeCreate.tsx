import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import GraphqlOfficeRepository from 'src/apis/graphql/office';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { Office } from 'src/@types/office';
import OfficeNewEditForm from 'src/sections/@dashboard/office/OfficeNewEditForm';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import { capitalCase } from 'change-case';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function OfficeCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [currentOffice, setCurrentOffice] = useState<Office>();

  useQuery(
    ['fetchOfficeDetail', _id],
    () =>
      GraphqlOfficeRepository.fetchOfficeDetail({
        officeInput: {
          _id,
        },
      }),
    {
      enabled: _id.length > 0,
      refetchOnWindowFocus: false,
      onError() {
        enqueueSnackbar('Không thể lấy chi tiết văn phòng!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.errors) {
          setCurrentOffice(data.data.officeDetail);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );

  const isEdit = pathname.includes('edit');

  return (
    <Page title={!isEdit ? 'Office: Create a new office' : 'Office: Edit a office'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new office' : 'Edit Office'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Office', href: PATH_DASHBOARD.office.list },
            { name: !isEdit ? 'New Office' : capitalCase(_id) },
          ]}
        />

        <OfficeNewEditForm isEdit={isEdit} currentOffice={currentOffice} />
      </Container>
    </Page>
  );
}
