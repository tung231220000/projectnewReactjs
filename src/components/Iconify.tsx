import React from 'react';
import {Box, BoxProps, SxProps} from '@mui/material';
import {Icon, IconifyIcon} from '@iconify/react';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  sx?: SxProps;
  icon: IconifyIcon | string;
}

export default function Iconify({icon, sx, ...other}: Props) {
  return <Box sx={{...sx}} {...other} ><Icon icon={icon}/></Box>;
}