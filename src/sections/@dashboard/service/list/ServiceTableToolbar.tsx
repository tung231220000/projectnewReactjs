import { Box, InputAdornment, TextField } from '@mui/material';

import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  filterKey: string;
  onFilterKey: (value: string) => void;
};

export default function ServiceTableToolbar({ filterKey, onFilterKey }: Props) {
  return (
    <Box sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        value={filterKey}
        onChange={(event) => onFilterKey(event.target.value)}
        placeholder="Search service..."
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
