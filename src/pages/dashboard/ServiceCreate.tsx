import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import GraphqlServiceRepository from 'src/apis/graphql/service';
import GraphqlTrademarkRepository from 'src/apis/graphql/trademark';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import { Service } from 'src/@types/service';
import ServiceNewEditForm from 'src/sections/@dashboard/service/ServiceNewEditForm';
import { Trademark } from 'src/@types/trademark';
import { capitalCase } from 'change-case';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function ServiceCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [trademarks, setTrademarks] = useState<Trademark[]>([]);
  const [currentService, setCurrentService] = useState<Service>();

  useQuery(['fetchTrademarks'], () => GraphqlTrademarkRepository.fetchTrademarks(), {
    refetchOnWindowFocus: false,
    onError() {
      enqueueSnackbar('Không thể lấy danh sách thương hiệu!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.errors) {
        setTrademarks(data.data.trademarks);
      } else {
        enqueueSnackbar(data.errors[0].message, {
          variant: 'error',
        });
      }
    },
  });
  useQuery(
    ['fetchServiceDetail', _id],
    () =>
      GraphqlServiceRepository.fetchServiceDetail({
        serviceInput: {
          _id,
        },
      }),
    {
      enabled: _id.length > 0,
      refetchOnWindowFocus: false,
      onError() {
        enqueueSnackbar('Không thể lấy chi tiết linh kiện!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.errors) {
          setCurrentService(data.data.serviceDetail);
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
    <Page title={!isEdit ? 'Service: Create a new service' : 'Service: Edit a service'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new service' : 'Edit Service'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Service', href: PATH_DASHBOARD.service.list },
            { name: !isEdit ? 'New Service' : capitalCase(_id) },
          ]}
        />

        {trademarks.length > 0 && (
          <ServiceNewEditForm
            trademarks={trademarks}
            isEdit={isEdit}
            currentService={currentService}
          />
        )}
      </Container>
    </Page>
  );
}
