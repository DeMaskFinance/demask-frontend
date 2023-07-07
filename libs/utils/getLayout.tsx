import React from 'react';
import { Layout, LayoutSecondary } from '@/components/Layouts';
import Home from '@/pages';

const getLayout = (page: React.ReactNode) => {
  // Xác định layout dựa trên trang
  if (page && (page as any).type === Home) {
    return <LayoutSecondary>{page}</LayoutSecondary>;
  }
  return <Layout>{page}</Layout>;
};

export default getLayout;