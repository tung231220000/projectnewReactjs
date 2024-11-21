import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import GraphqlServiceRepository from 'src/apis/graphql/service';
import GraphqlSolutionRepository from 'src/apis/graphql/solution';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import { Service } from 'src/@types/service';
import { Solution } from 'src/@types/solution';
import SolutionNewEditForm from 'src/sections/@dashboard/solution/SolutionNewEditForm';
import { capitalCase } from 'change-case';
import useAdvantage from 'src/hooks/useAdvantage';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useSolutionCategory from 'src/hooks/useSolutionCategory';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function SolutionCreate() {
  const { pathname } = useLocation();
  const { key = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const { solutionCategories } = useSolutionCategory();
  const { advantages } = useAdvantage();

  const [services, setServices] = useState<Service[]>([]);
  const [currentSolution, setCurrentSolution] = useState<Solution>();

  useQuery(['fetchServices'], () => GraphqlServiceRepository.fetchServices(), {
    refetchOnWindowFocus: false,
    onError() {
      enqueueSnackbar('Không thể lấy danh sách linh kiện!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.errors) {
        setServices(data.data.services);
      } else {
        enqueueSnackbar(data.errors[0].message, {
          variant: 'error',
        });
      }
    },
  });
  useQuery(
    ['fetchSolutionDetail', key],
    () =>
      GraphqlSolutionRepository.fetchSolutionDetail({
        solutionInput: {
          key,
        },
      }),
    {
      enabled: key.length > 0,
      refetchOnWindowFocus: false,
      onError() {
        enqueueSnackbar('Không thể lấy chi tiết giải pháp!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.errors) {
          setCurrentSolution(data.data.solutionDetail);
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
    <Page title={!isEdit ? 'Solution: Create a new solution' : 'Solution: Edit a solution'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new solution' : 'Edit Solution'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Solution', href: PATH_DASHBOARD.solution.list },
            { name: !isEdit ? 'New Solution' : capitalCase(key) },
          ]}
        />

        {solutionCategories.length && advantages.length && services.length > 0 && (
          <SolutionNewEditForm
            categories={solutionCategories}
            advantages={advantages}
            services={services}
            isEdit={isEdit}
            currentSolution={currentSolution}
          />
        )}
      </Container>
    </Page>
  );
}
