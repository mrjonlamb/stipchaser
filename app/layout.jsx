import '../src/styles/tailwind.css';
import '../src/styles/index.css';
import ErrorBoundary from '../src/components/ErrorBoundary';

export const metadata = {
  title: 'StipChaser - Document Collection Platform',
  description: 'Streamline document collection for car dealerships',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

