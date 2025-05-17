// Import the Providers
import { Providers } from "../providers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Providers>{children}</Providers>
    </main>
  );
}
