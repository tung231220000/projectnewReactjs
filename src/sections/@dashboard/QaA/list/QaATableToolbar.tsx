import { Box, InputAdornment, TextField } from '@mui/material';

import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  filterQuestion: string;
  onFilterTitle: (value: string) => void;
};

export default function QaATableToolbar({ filterQuestion, onFilterTitle }: Props) {
  return (
    <Box sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        value={filterQuestion}
        onChange={(event) => onFilterTitle(event.target.value)}
        placeholder="Search question and answer..."
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
