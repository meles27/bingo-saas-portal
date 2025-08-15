import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Outlet } from 'react-router-dom';
export const SiteLayout: React.FC = () => {
  // just for re-render during changing routes

  return (
    <>
      <div className="flex flex-col w-screen h-screen">
        {/* <SiteHeader /> */}
        <div className="flex w-full h-full overflow-auto">
          <AnimatePresence>
            <Outlet key={'site-layout-key'} />
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
