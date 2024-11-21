import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import GraphqlInformationRepository from 'src/apis/graphql/information';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { Information } from 'src/@types/information';
import InformationNewEditForm from 'src/sections/@dashboard/information/InformationNewEditForm';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import { capitalCase } from 'change-case';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function InformationCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [currentInformation, setCurrentInformation] = useState<Information>();

  useQuery(
    ['fetchInformationDetail', _id],
    () =>
      GraphqlInformationRepository.fetchInformationDetail({
        informationInput: {
          _id,
        },
      }),
    {
      enabled: _id.length > 0,
      refetchOnWindowFocus: false,
      onError() {
        enqueueSnackbar('Không thể lấy chi tiết thông tin!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.errors) {
          setCurrentInformation(data.data.informationDetail);
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
    <Page
      title={!isEdit ? 'Information: Create a new information' : 'Information: Edit a information'}
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new information' : 'Edit Information'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Information', href: PATH_DASHBOARD.information.list },
            { name: !isEdit ? 'New Information' : capitalCase(_id) },
          ]}
        />

        <InformationNewEditForm isEdit={isEdit} currentInformation={currentInformation} />
      </Container>
    </Page>
  );
}
