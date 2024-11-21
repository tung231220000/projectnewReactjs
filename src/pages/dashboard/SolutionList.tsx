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
import GraphqlSolutionRepository, {
  DeleteManySolutionsPayload,
  DeleteSolutionPayload,
} from 'src/apis/graphql/solution';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { SolutionTableRow, SolutionTableToolbar } from 'src/sections/@dashboard/solution/list';
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
import { Solution } from 'src/@types/solution';
import { paramCase } from 'change-case';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'key', label: 'Key', align: 'left' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function SolutionList() {
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

  const [tableData, setTableData] = useState<Solution[]>([]);
  const [filterTitle, setFilterTitle] = useState('');

  useQuery(['fetchSolutions'], () => GraphqlSolutionRepository.fetchSolutions(), {
    refetchOnWindowFocus: false,
    onError() {
      enqueueSnackbar('Không thể lấy danh sách giải pháp!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.errors) {
        setTableData(data.data.solutions);
      } else {
        enqueueSnackbar(data.errors[0].message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncDeleteSolution } = useMutation(
    (payload: DeleteSolutionPayload) => GraphqlSolutionRepository.deleteSolution(payload),
    {
      onError() {
        enqueueSnackbar('Không thể xóa giải pháp!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          setTableData(
            tableData.filter((solution) => solution._id !== data.data.deleteSolution._id)
          );
          enqueueSnackbar('Xóa giải pháp thành công!', {
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
  const { mutateAsync: mutateAsyncDeleteManySolutions } = useMutation(
    (payload: DeleteManySolutionsPayload) => GraphqlSolutionRepository.deleteManySolutions(payload),
    {
      onError() {
        enqueueSnackbar('Không thể xóa nhiều giải pháp!', {
          variant: 'error',
        });
      },
    }
  );

  const handleFilterTitle = (filterTitle: string) => {
    setFilterTitle(filterTitle);
    setPage(0);
  };

  const handleDeleteRow = (_id: string) => {
    mutateAsyncDeleteSolution({
      solutionInput: {
        _id,
      },
    });
    setSelected([]);
  };

  const handleDeleteRows = async (_ids: string[]) => {
    const response = await mutateAsyncDeleteManySolutions({
      solutionInput: {
        _ids,
      },
    });
    setTableData(tableData.filter((solution) => !_ids.includes(solution._id)));
    enqueueSnackbar(response.data.deleteManySolutions, {
      variant: 'success',
    });
    setSelected([]);
  };

  const handleEditRow = (key: string) => {
    navigate(PATH_DASHBOARD.solution.edit(paramCase(key)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterTitle,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterTitle) || !tableData.length;

  return (
    <Page title="Solution: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Solution List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Solution', href: PATH_DASHBOARD.solution.list },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.solution.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Solution
            </Button>
          }
        />

        <Card>
          <SolutionTableToolbar filterTitle={filterTitle} onFilterTitle={handleFilterTitle} />

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
                      <SolutionTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row.key)}
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
  filterTitle,
}: {
  tableData: Solution[];
  comparator: (a: any, b: any) => number;
  filterTitle: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterTitle) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.title.toLowerCase().indexOf(filterTitle.toLowerCase()) !== -1
    );
  }

  return tableData;
}
