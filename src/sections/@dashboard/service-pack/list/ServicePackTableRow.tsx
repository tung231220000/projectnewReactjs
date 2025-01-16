import { Checkbox, MenuItem, TableCell, TableRow } from '@mui/material';

import Iconify from '../../../../components/Iconify';
import NumberFormat from 'react-number-format';
import { ServicePack } from 'src/@types/service-pack';
import { TableMoreMenu } from '../../../../components/table';
import { useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  row: ServicePack;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function ServicePackTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { prices } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{prices[0].name}</TableCell>

      <TableCell align="left">
        <NumberFormat
          value={prices[0].defaultPrice}
          displayType={'text'}
          thousandSeparator
          suffix={' VNĐ'}
        />
      </TableCell>

      <TableCell align="left">
        <NumberFormat
          value={prices[0].salePrice ? prices[0].salePrice : 0}
          displayType={'text'}
          thousandSeparator
          suffix={' VNĐ'}
        />
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
