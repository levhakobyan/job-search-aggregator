import Providers from './providers';
import 'antd/dist/reset.css'; // Import Ant Design styles
import './globals.css'; // Your global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
