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
import GraphqlTrademarkRepository, {
  DeleteManyTrademarksPayload,
  DeleteTrademarkPayload,
} from 'src/apis/graphql/trademark';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from '../../components/table';
import { TrademarkTableRow, TrademarkTableToolbar } from 'src/sections/@dashboard/trademark/list';
import { useMutation, useQuery } from '@tanstack/react-query';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { Trademark } from 'src/@types/trademark';
import { paramCase } from 'change-case';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'logo', label: 'Logo', align: 'center' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function TrademarkList() {
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

  const [tableData, setTableData] = useState<Trademark[]>([]);
  const [filterName, setFilterName] = useState('');

  useQuery(['fetchTrademarks'], () => GraphqlTrademarkRepository.fetchTrademarks(), {
    refetchOnWindowFocus: false,
    onError() {
      enqueueSnackbar('Không thể lấy danh sách thương hiệu!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.errors) {
        setTableData(data.data.trademarks);
      } else {
        enqueueSnackbar(data.errors[0].message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncDeleteTrademark } = useMutation(
    (payload: DeleteTrademarkPayload) => GraphqlTrademarkRepository.deleteTrademark(payload),
    {
      onError() {
        enqueueSnackbar('Không thể xóa thương hiệu!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          setTableData(
            tableData.filter((trademark) => trademark._id !== data.data.deleteTrademark._id)
          );
          enqueueSnackbar('Xóa thương hiệu thành công!', {
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
  const { mutateAsync: mutateAsyncDeleteManyTrademarks } = useMutation(
    (payload: DeleteManyTrademarksPayload) =>
      GraphqlTrademarkRepository.deleteManyTrademarks(payload),
    {
      onError() {
        enqueueSnackbar('Không thể xóa nhiều thương hiệu!', {
          variant: 'error',
        });
      },
    }
  );

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (_id: string) => {
    setSelected([]);
    mutateAsyncDeleteTrademark({
      trademarkInput: {
        _id,
      },
    });
  };

  const handleDeleteRows = async (_ids: string[]) => {
    setSelected([]);
    const response = await mutateAsyncDeleteManyTrademarks({
      trademarkInput: {
        _ids,
      },
    });
    setTableData(tableData.filter((trademark) => !_ids.includes(trademark._id)));
    enqueueSnackbar(response.data.deleteManyTrademarks, {
      variant: 'success',
    });
  };

  const handleEditRow = (_id: string) => {
    navigate(PATH_DASHBOARD.trademark.edit(paramCase(_id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterName) || !tableData.length;

  return (
    <Page title="Trademark: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Trademark List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Trademark', href: PATH_DASHBOARD.trademark.list },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.trademark.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Trademark
            </Button>
          }
        />

        <Card>
          <TrademarkTableToolbar filterName={filterName} onFilterName={handleFilterName} />

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
                      <TrademarkTableRow
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
  filterName,
}: {
  tableData: Trademark[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return tableData;
}
