import React from "react";
import { LogIn, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useToast } from "../../context/ToastContext.tsx";

interface AuthFormProps {
  authMode: "login" | "signup";
  setAuthMode: (mode: "login" | "signup") => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Authentication Form Component.
 * Handles both Login and Signup modes with role-based metadata for registration.
 */
export const AuthForm: React.FC<AuthFormProps> = ({ authMode, setAuthMode, onSubmit }) => {
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#141414] p-12 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/logo.webp" alt="Logo" className="w-16 h-16 object-contain mb-4 rounded-xl shadow-lg" />
          <h1 className="font-serif italic text-4xl tracking-tight mb-2">College Sports</h1>
          <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Secure Access Portal</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          {authMode === "signup" && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest font-bold">Full Name</label>
                <input name="full_name" required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest font-bold">Role</label>
                <select name="role" required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-indigo-500">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin (Sir)</option>
                  <option value="viewer">Viewer (No Auth)</option>
                </select>
              </div>
            </>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">Email Address</label>
            <input name="email" type="email" required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest font-bold">Password</label>
            <input name="password" type="password" required className="bg-transparent border-b border-[#141414] p-2 focus:outline-none focus:border-emerald-500" />
          </div>

          <button type="submit" className="bg-[#141414] text-[#E4E3E0] py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
            {authMode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
            {authMode === "login" ? "Sign In" : "Create Account"}
          </button>

          {authMode === "login" && (
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-4">
                <div className="h-[1px] bg-[#141414]/10 flex-1" />
                <span className="text-[9px] uppercase tracking-widest opacity-30 font-bold">Or continue with</span>
                <div className="h-[1px] bg-[#141414]/10 flex-1" />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const { signInWithGoogle } = await import("../../services/firebase.js");
                      const { apiService } = await import("../../services/api.service.js");
                      const idToken = await signInWithGoogle();
                      const result = await apiService.socialLogin(idToken);

                      if (!result.success) {
                        showToast(result.message, "error");
                        return;
                      }

                      localStorage.setItem("token", result.data.token);
                      localStorage.setItem("user", JSON.stringify(result.data.user));
                      window.location.reload(); // Refresh to update user state
                    } catch (err: any) {
                      showToast(err.message, "error");
                    }
                  }}
                  className="flex-1 py-3 border border-[#141414] rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#141414] hover:text-[#E4E3E0] transition-all flex items-center justify-center gap-2"
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const { signInWithFacebook } = await import("../../services/firebase.js");
                      const { apiService } = await import("../../services/api.service.js");
                      const idToken = await signInWithFacebook();
                      const result = await apiService.socialLogin(idToken);

                      if (!result.success) {
                        showToast(result.message, "error");
                        return;
                      }

                      localStorage.setItem("token", result.data.token);
                      localStorage.setItem("user", JSON.stringify(result.data.user));
                      window.location.reload();
                    } catch (err: any) {
                      showToast(err.message, "error");
                    }
                  }}
                  className="flex-1 py-3 border border-[#141414] rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#141414] hover:text-[#E4E3E0] transition-all flex items-center justify-center gap-2"
                >
                  Facebook
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-8 pt-8 border-t border-[#141414]/10 text-center">
          <button
            onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
            className="text-[11px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 transition-opacity"
          >
            {authMode === "login" ? "Need an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
