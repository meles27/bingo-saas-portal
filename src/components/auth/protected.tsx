import React from 'react';

interface ProtectedProps {
  isAllowed: boolean;
  children: React.ReactNode;
}

export const Protected: React.FC<ProtectedProps> = ({
  isAllowed,
  children
}) => {
  if (!isAllowed) return null;
  else return children;
};
