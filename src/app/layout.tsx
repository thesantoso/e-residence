import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ResidentProvider } from '@/context/ResidentContext';
import { SystemSettingsProvider } from '@/context/SystemSettingsContext';
import { UserManagementProvider } from '@/context/UserManagementContext';
import { ToastProvider } from '@/context/ToastContext';
import ToastContainer from '@/components/ui/alert/ToastContainer';
import QueryProvider from '@/providers/QueryProvider';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <QueryProvider>
          <ToastProvider>
            <ThemeProvider>
              <AuthProvider>
                <SystemSettingsProvider>
                  <UserManagementProvider>
                    <ResidentProvider>
                      <SidebarProvider>
                        {children}
                        <ToastContainer />
                      </SidebarProvider>
                    </ResidentProvider>
                  </UserManagementProvider>
                </SystemSettingsProvider>
              </AuthProvider>
            </ThemeProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
