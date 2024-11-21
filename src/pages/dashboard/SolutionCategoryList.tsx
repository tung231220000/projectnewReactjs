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
  SolutionCategoryTableRow,
  SolutionCategoryTableToolbar,
} from 'src/sections/@dashboard/solution-category/list';
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
import { SolutionCategory } from 'src/@types/solution-category';
import { paramCase } from 'change-case';
import useSettings from '../../hooks/useSettings';
import useSolutionCategory from 'src/hooks/useSolutionCategory';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'icon', label: 'Icon', align: 'center' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function SolutionCategoryList() {
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
  const { solutionCategories, deleteSolutionCategory, deleteManySolutionCategories } =
    useSolutionCategory();

  const [tableData, setTableData] = useState(solutionCategories);
  const [filterTitle, setFilterTitle] = useState('');

  useEffect(() => {
    setTableData(solutionCategories);
  }, [solutionCategories]);

  const handleFilterTitle = (filterTitle: string) => {
    setFilterTitle(filterTitle);
    setPage(0);
  };

  const handleDeleteRow = (_id: string) => {
    setSelected([]);
    deleteSolutionCategory(_id);
  };

  const handleDeleteRows = (selected: string[]) => {
    setSelected([]);
    deleteManySolutionCategories(selected);
  };

  const handleEditRow = (_id: string) => {
    navigate(PATH_DASHBOARD.solutionCategory.edit(paramCase(_id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterTitle,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterTitle) || !tableData.length;

  return (
    <Page title="Solution Category: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Solution Category List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Solution Category', href: PATH_DASHBOARD.solutionCategory.list },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.solutionCategory.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Solution Category
            </Button>
          }
        />

        <Card>
          <SolutionCategoryTableToolbar
            filterTitle={filterTitle}
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
                      <SolutionCategoryTableRow
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
  filterTitle,
}: {
  tableData: SolutionCategory[];
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
