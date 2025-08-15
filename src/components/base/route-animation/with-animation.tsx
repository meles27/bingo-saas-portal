// withAnimation.tsx
import { motion } from 'framer-motion';
import React from 'react';
import { style } from './_style';

// Define a type for the props of the wrapped component
type WithAnimationProps = {
  children?: React.ReactNode;
};

// Create the higher-order component
const withAnimation = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithAnimationProps>
) => {
  const AnimatedComponent: React.FC<P & WithAnimationProps> = (props) => {
    return (
      <motion.section {...style}>
        <WrappedComponent {...(props as P)} />
      </motion.section>
    );
  };

  return AnimatedComponent;
};

export default withAnimation;
