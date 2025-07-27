import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: 'Dashboard | Fluentish',
  description: 'Your personalized Fluentish dashboard.'
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Redirect based on user role
  if (session.user.role === "INSTITUTION") {
    redirect("/institution/dashboard");
  } else if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  } else if (session.user.role === "STUDENT") {
    redirect("/student");
  }

  // Fallback redirect to home page if role is not recognized
  redirect("/");
} 