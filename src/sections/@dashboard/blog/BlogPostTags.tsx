import React from "react";
import { Avatar, AvatarGroup, Box, Checkbox, Chip, FormControlLabel } from '@mui/material';

import Iconify from '../../../components/Iconify';
import { Post } from '../../../@types/post';
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

type Props = {
  post: Post;
};

export default function BlogPostTags({ post }: Props) {
  const { favorite, tags, favoritePerson } = post;

  return (
    <Box sx={{ py: 3 }}>
      {tags.map((tag) => (
        <Chip key={tag} label={tag} sx={{ m: 0.5 }} />
      ))}

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              size="small"
              color="error"
              icon={<Iconify icon="eva:heart-fill" />}
              checkedIcon={<Iconify icon="eva:heart-fill" />}
            />
          }
          label={fShortenNumber(favorite)}
        />
        <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': { width: 32, height: 32 },
          }}
        >
          {favoritePerson.map((person) => (
            <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
          ))}
        </AvatarGroup>
      </Box>
    </Box>
  );
}