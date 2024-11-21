import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import GraphqlTrademarkRepository from 'src/apis/graphql/trademark';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import { Trademark } from 'src/@types/trademark';
import TrademarkNewEditForm from 'src/sections/@dashboard/trademark/TrademarkNewEditForm';
import { capitalCase } from 'change-case';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function TrademarkCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [currentTrademark, setCurrentTrademark] = useState<Trademark>();

  useQuery(
    ['fetchTrademarkDetail', _id],
    () =>
      GraphqlTrademarkRepository.fetchTrademarkDetail({
        trademarkInput: {
          _id,
        },
      }),
    {
      enabled: _id.length > 0,
      refetchOnWindowFocus: false,
      onError() {
        enqueueSnackbar('Không thể lấy chi tiết thương hiệu!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.errors) {
          setCurrentTrademark(data.data.trademarkDetail);
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
    <Page title={!isEdit ? 'Trademark: Create a new trademark' : 'Trademark: Edit a trademark'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new trademark' : 'Edit Trademark'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Trademark', href: PATH_DASHBOARD.trademark.list },
            { name: !isEdit ? 'New Trademark' : capitalCase(_id) },
          ]}
        />

        <TrademarkNewEditForm isEdit={isEdit} currentTrademark={currentTrademark} />
      </Container>
    </Page>
  );
}
