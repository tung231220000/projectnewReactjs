import React from 'react';
import Page from "@/components/Page";
import { styled } from '@mui/material/styles';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));
const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

export default function Login() {
  return (
    
      <Page title="Login">
        <RootStyle>
          <HeaderStyle>
            <img alt="logo" src="/static/logo.svg" />
          </HeaderStyle>
        </RootStyle>
      </Page>
  );
}