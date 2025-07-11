import { useState } from "react";
import { supabase } from "../components/supabaseClient";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        alert(error.message);
      } else {
        navigate("/dashboard");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        alert(error.message);
        return;
      }

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({ email, password });

      setLoading(false);

      if (loginError) {
        alert(loginError.message);
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-darkBlue p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-heading0 font-heading font-bold text-center text-mist">
          {isLogin ? "Log In" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <div className="flex justify-center pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-steelBlue font-paragraph">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-paleBlue hover:underline"
            onClick={() => setIsLogin(!isLogin)}
            type="button"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
