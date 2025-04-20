import Navbar from '../../../components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <Navbar name="种子中心">
        <main className="p-6">{children}</main>
        </Navbar>
      </body>
    </html>
  );
}
