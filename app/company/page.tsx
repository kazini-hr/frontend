import { COMPANY_ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";

export default function CompanyPage() {
  redirect(COMPANY_ROUTES.DETAILS);
}
