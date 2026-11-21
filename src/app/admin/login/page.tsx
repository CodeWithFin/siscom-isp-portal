import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { requireAdmin } from "@/lib/session";

export default async function AdminLoginPage() {
  if (await requireAdmin()) redirect("/admin");

  return (
    <main className="min-h-screen bg-cloud px-4">
      <AdminLoginForm />
    </main>
  );
}
