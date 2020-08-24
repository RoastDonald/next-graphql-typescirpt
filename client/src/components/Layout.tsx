import React from 'react';
import NavBar from './NavBar';
import { Wrapper, WrapperVariant } from './Wrapper';

type LayoutProps = {
  children: any;
  variant: WrapperVariant;
};

export const Layout = ({ children, variant }: LayoutProps) => (
  <>
    <NavBar />
    <Wrapper variant={variant}>{children}</Wrapper>
  </>
);
