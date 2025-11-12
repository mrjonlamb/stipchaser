import { Metadata } from "next";
import "../src/styles/tailwind.css";
import "../src/styles/index.css";
import ErrorBoundary from "../src/components/ErrorBoundary";
import { AuthProvider } from "../lib/auth-context";

export const metadata: Metadata = {
  title: "StipChaser - Document Collection Platform",
  description: "Streamline document collection for car dealerships",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
