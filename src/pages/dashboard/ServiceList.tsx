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
import GraphqlServiceRepository, {
  DeleteManyServicesPayload,
  DeleteServicePayload,
} from 'src/apis/graphql/service';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ServiceTableRow, ServiceTableToolbar } from 'src/sections/@dashboard/service/list';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from '../../components/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { Service } from 'src/@types/service';
import { paramCase } from 'change-case';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'thumbnail', label: 'Thumbnail', align: 'center' },
  { id: 'key', label: 'Key', align: 'left' },
  { id: 'trademark', label: 'Trademark', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function ServiceList() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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

  const [tableData, setTableData] = useState<Service[]>([]);
  const [filterKey, setFilterKey] = useState('');

  useQuery(['fetchServices'], () => GraphqlServiceRepository.fetchServices(), {
    refetchOnWindowFocus: false,
    onError() {
      enqueueSnackbar('Không thể lấy danh sách linh kiện!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.errors) {
        setTableData(data.data.services);
      } else {
        enqueueSnackbar(data.errors[0].message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncDeleteService } = useMutation(
    (payload: DeleteServicePayload) => GraphqlServiceRepository.deleteService(payload),
    {
      onError() {
        enqueueSnackbar('Không thể xóa linh kiện!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          setTableData(tableData.filter((service) => service._id !== data.data.deleteService._id));
          enqueueSnackbar('Xóa linh kiện thành công!', {
            variant: 'success',
          });
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { mutateAsync: mutateAsyncDeleteManyServices } = useMutation(
    (payload: DeleteManyServicesPayload) => GraphqlServiceRepository.deleteManyServices(payload),
    {
      onError() {
        enqueueSnackbar('Không thể xóa nhiều linh kiện!', {
          variant: 'error',
        });
      },
    }
  );

  const handleFilterKey = (filterKey: string) => {
    setFilterKey(filterKey);
    setPage(0);
  };

  const handleDeleteRow = (_id: string) => {
    mutateAsyncDeleteService({
      serviceInput: {
        _id,
      },
    });
    setSelected([]);
  };

  const handleDeleteRows = async (_ids: string[]) => {
    const response = await mutateAsyncDeleteManyServices({
      serviceInput: {
        _ids,
      },
    });
    setTableData(tableData.filter((service) => !_ids.includes(service._id)));
    enqueueSnackbar(response.data.deleteManyServices, {
      variant: 'success',
    });
    setSelected([]);
  };

  const handleEditRow = (key: string) => {
    navigate(PATH_DASHBOARD.service.edit(paramCase(key)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterKey,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterKey) || !tableData.length;

  return (
    <Page title="Service: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Service List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Service', href: PATH_DASHBOARD.service.list },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.service.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Service
            </Button>
          }
        />

        <Card>
          <ServiceTableToolbar filterKey={filterKey} onFilterKey={handleFilterKey} />

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
                      <ServiceTableRow
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
  filterKey,
}: {
  tableData: Service[];
  comparator: (a: any, b: any) => number;
  filterKey: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterKey) {
    tableData = tableData.filter(
      (item: Record<string, any>) => item.key.toLowerCase().indexOf(filterKey.toLowerCase()) !== -1
    );
  }

  return tableData;
}
