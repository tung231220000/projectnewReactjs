import React from "react";
import { MenuItem, TableCell, TableRow } from '@mui/material';

import Iconify from '../../../../components/Iconify';
import { Page } from 'src/@types/page';
import { TableMoreMenu } from '../../../../components/table';
import { useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  row: Page;
  onEditRow: VoidFunction;
};

export default function PageTableRow({ row, onEditRow }: Props) {
  const { name, title } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover>
      <TableCell align="left">{name}</TableCell>

      <TableCell align="left">{title}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <MenuItem
              onClick={() => {
                onEditRow();
                handleCloseMenu();
              }}
            >
              <Iconify icon={'eva:edit-fill'} />
              Edit
            </MenuItem>
          }
        />
      </TableCell>
    </TableRow>
  );
}
