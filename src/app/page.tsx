import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "HR_ADMIN") {
    redirect("/admin/dashboard");
  } else {
    redirect("/employee/dashboard");
  }
}
