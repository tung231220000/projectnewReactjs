import { Box, InputAdornment, TextField } from '@mui/material';

import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  onFilterTitle: (value: string) => void;
};

export default function PriceTableToolbar({ filterName, onFilterTitle }: Props) {
  return (
    <Box sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterTitle(event.target.value)}
        placeholder="Search price..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={'eva:search-fill'}
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
