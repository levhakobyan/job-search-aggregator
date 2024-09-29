'use client';

import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SWRConfig value={{ dedupingInterval: 15 * 60 * 1000 }}>
            <ConfigProvider>
                {children}
            </ConfigProvider>
        </SWRConfig>
    );
}
