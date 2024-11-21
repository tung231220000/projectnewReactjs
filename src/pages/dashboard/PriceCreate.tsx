import { capitalCase, paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import PriceNewEditForm from 'src/sections/@dashboard/price/PriceNewEditForm';
import usePrice from 'src/hooks/usePrice';
import useSettings from '../../hooks/useSettings';

// ----------------------------------------------------------------------

export default function PriceCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { themeStretch } = useSettings();
  const { prices } = usePrice();

  const isEdit = pathname.includes('edit');
  const currentPrice = prices.find((price) => paramCase(price._id) === _id);

  return (
    <Page title={!isEdit ? 'Price: Create a new price' : 'Price: Edit a price'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new price' : 'Edit Price'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Price', href: PATH_DASHBOARD.price.list },
            { name: !isEdit ? 'New Price' : capitalCase(_id) },
          ]}
        />

        <PriceNewEditForm isEdit={isEdit} currentPrice={currentPrice} />
      </Container>
    </Page>
  );
}
