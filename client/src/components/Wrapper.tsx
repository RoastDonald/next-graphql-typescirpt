import { Box } from '@chakra-ui/core';
import React from 'react';

export type WrapperVariant = 'small' | 'regular';

type WrapperProps = {
  variant?: WrapperVariant;
  children: any;
};

export const Wrapper = ({ children, variant = 'regular' }: WrapperProps) => {
  return (
    <Box
      maxW={variant === 'regular' ? '800px' : '400px'}
      w="100%"
      mt={8}
      mx="auto"
    >
      {children}
    </Box>
  );
};
