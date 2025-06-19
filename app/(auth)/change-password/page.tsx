import { PasswordChangeForm } from "@/components/forms/password-change-form";
export default function PasswordChangePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <PasswordChangeForm />
      </div>
    </div>
  );
}
