import Header from "@/components/Header";
import PrivateRoute from "@/components/PrivateRoute";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <Header />
      <main>{children}</main>
    </PrivateRoute>
  );
}
