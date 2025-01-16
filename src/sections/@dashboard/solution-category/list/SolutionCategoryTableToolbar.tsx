import { Box, InputAdornment, TextField } from '@mui/material';

import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  filterTitle: string;
  onFilterTitle: (value: string) => void;
};

export default function SolutionCategoryTableToolbar({ filterTitle, onFilterTitle }: Props) {
  return (
    <Box sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        value={filterTitle}
        onChange={(event) => onFilterTitle(event.target.value)}
        placeholder="Search solution category..."
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
