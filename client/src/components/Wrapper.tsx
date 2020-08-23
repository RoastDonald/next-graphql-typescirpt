import { Box } from '@chakra-ui/core';
import React from 'react';

type WrapperProps = {
  variant?: 'small' | 'regular';
  children: any;
};

const Wrapper = ({ children, variant = 'regular' }: WrapperProps) => {
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

export default Wrapper;
