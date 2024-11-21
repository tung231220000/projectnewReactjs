import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import GraphqlPartnerRepository from 'src/apis/graphql/partner';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import { Partner } from 'src/@types/partner';
import PartnerNewEditForm from 'src/sections/@dashboard/partner/PartnerNewEditForm';
import { capitalCase } from 'change-case';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function PartnerCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [currentPartner, setCurrentPartner] = useState<Partner>();

  useQuery(
    ['fetchPartnerDetail', _id],
    () =>
      GraphqlPartnerRepository.fetchPartnerDetail({
        partnerInput: {
          _id,
        },
      }),
    {
      enabled: _id.length > 0,
      refetchOnWindowFocus: false,
      onError() {
        enqueueSnackbar('Không thể lấy chi tiết đối tác!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.errors) {
          setCurrentPartner(data.data.partnerDetail);
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
    <Page title={!isEdit ? 'Partner: Create a new partner' : 'Partner: Edit a partner'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new partner' : 'Edit Partner'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Partner', href: PATH_DASHBOARD.partner.list },
            { name: !isEdit ? 'New Partner' : capitalCase(_id) },
          ]}
        />

        <PartnerNewEditForm isEdit={isEdit} currentPartner={currentPartner} />
      </Container>
    </Page>
  );
}
