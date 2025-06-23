// components/ProtectedRouteWithModal.tsx
import { useEffect } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export const ProtectedRouteWithModal = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { isLoaded, signIn } = useSignIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !user) {
      // Redirect to sign-in page if not signed in
      navigate("/sign-in");
    }
  }, [user, isLoaded, navigate]);

  if (!user) return null; // prevent rendering checkout if not signed in
  return <>{children}</>;
};
