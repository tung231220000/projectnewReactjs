import { Container } from '@mui/material';
import GraphqlPageRepository from 'src/apis/graphql/page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import PageEditForm from 'src/sections/@dashboard/page/PageEditForm';
import { Page as TPage } from 'src/@types/page';
import { capitalCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function PageEdit() {
  const { name = '' } = useParams();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const [currentPage, setCurrentPage] = useState<TPage>();

  useQuery(
    ['fetchPageData', name],
    () =>
      GraphqlPageRepository.fetchPageData({
        pageInput: {
          name,
        },
      }),
    {
      enabled: name.length > 0,
      refetchOnWindowFocus: false,
      onError() {
        enqueueSnackbar('Không thể lấy chi tiết trang!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.errors) {
          setCurrentPage(data.data.getPageData);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );

  return (
    <Page title="Page: Edit a page">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit Advantage"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Advantage', href: PATH_DASHBOARD.page.list },
            { name: capitalCase(name) },
          ]}
        />

        {!!currentPage && <PageEditForm currentPage={currentPage} />}
      </Container>
    </Page>
  );
}
