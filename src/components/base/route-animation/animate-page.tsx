import { motion } from 'framer-motion';
import React from 'react';
import { style } from './_style';

export interface AnimatePageProps {
  name?: string;
  children?: React.ReactNode;
}
export const AnimatePage: React.FC<AnimatePageProps> = (props) => {
  return <motion.div {...style}>{props.children}</motion.div>;
};
