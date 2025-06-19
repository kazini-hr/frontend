import { LoginForm } from "@/components/forms/signin-form";

export default function Signin() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <LoginForm />
      </div>
    </div>
  );
}
