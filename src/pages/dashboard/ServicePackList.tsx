import {
  Box,
  Button,
  Card,
  Container,
  FormControlLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  ServicePackTableRow,
  ServicePackTableToolbar,
} from 'src/sections/@dashboard/service-pack/list';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from '../../components/table';
import { useEffect, useState } from 'react';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { ServicePack } from 'src/@types/service-pack';
import { paramCase } from 'change-case';
import useServicePack from 'src/hooks/useServicePack';
import useSettings from '../../hooks/useSettings';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'price-name', label: 'Price Name', align: 'left' },
  { id: 'default-price', label: 'Default Price', align: 'left' },
  { id: 'sale-price', label: 'Sale Price', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function ServicePackList() {
  const navigate = useNavigate();

  const { themeStretch } = useSettings();
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    setPage,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const { servicePacks, deleteServicePack, deleteManyServicePacks } = useServicePack();

  const [tableData, setTableData] = useState(servicePacks);
  const [filterPriceName, setFilterPriceName] = useState('');

  useEffect(() => {
    setTableData(servicePacks);
  }, [servicePacks]);

  const handleFilterTitle = (filterPriceName: string) => {
    setFilterPriceName(filterPriceName);
    setPage(0);
  };

  const handleDeleteRow = (_id: string) => {
    setSelected([]);
    deleteServicePack({
      servicePackInput: {
        _id,
      },
    });
  };

  const handleDeleteRows = (_ids: string[]) => {
    setSelected([]);
    deleteManyServicePacks({
      servicePackInput: {
        _ids,
      },
    });
  };

  const handleEditRow = (_id: string) => {
    navigate(PATH_DASHBOARD.servicePack.edit(paramCase(_id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterPriceName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterPriceName) || !tableData.length;

  return (
    <Page title="Service Pack: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Service Pack List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Service Pack', href: PATH_DASHBOARD.servicePack.list },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.servicePack.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Service Pack
            </Button>
          }
        />

        <Card>
          <ServicePackTableToolbar
            filterPriceName={filterPriceName}
            onFilterTitle={handleFilterTitle}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ServicePackTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterPriceName,
}: {
  tableData: ServicePack[];
  comparator: (a: any, b: any) => number;
  filterPriceName: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterPriceName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.prices[0].name.toLowerCase().indexOf(filterPriceName.toLowerCase()) !== -1
    );
  }

  return tableData;
}
