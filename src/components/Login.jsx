import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ALLOWED_ADMINS } from "../admins";

const Login = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const name = params.get("name");
    const email = params.get("email");
    const github = params.get("github");

    if (name && email && github) {
      // ✅ If the user is an allowed admin
      if (ALLOWED_ADMINS.includes(github)) {
        navigate(`/admin?github=${github}`);
      } else {
        navigate(`/form?name=${name}&email=${email}&github=${github}`);
      }
    }
  }, []);

  const handleLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.PROD 
      ? "https://star-std2.onrender.com/api/callback"
      : "http://localhost:4000/api/callback";
    const scope = "read:user user:email";

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  return (
  <div className="flex flex-col md:flex-row min-h-screen bg-primary-black relative">
    {/* Left Half (Top on mobile) with Background Image */}
    <div
      className="w-full md:w-1/2 bg-cover bg-center h-[30vh] md:h-auto"
      style={{
        backgroundImage: "url('/Images/hero-bg.png')",
      }}
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0 md:inset-y-0 md:left-0 md:w-1/2 bg-black bg-opacity-40"></div>
    </div>

    {/* Right Half (Bottom on mobile) - Welcome & Login */}
    <div className="w-full md:w-1/2 flex items-center justify-center relative z-10 p-8 h-[70vh] md:h-auto">
      <div className="text-center max-w-xl w-full">
        <h1 className="text-3xl sm:text-4xl font-moonwalkmiss text-white mb-6 tracking-wider leading-normal">
          Welcome to <span className="text-primary-red">Start'er </span>
        </h1>

        <p className="font-orbitron mb-6 text-white">
          Star the repo, power the hack.
        </p>

        <button
          onClick={handleLogin}
          className="bg-primary-red hover:opacity-70 text-white font-orbitron py-3 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:scale-105"
        >
          Login with GitHub
        </button>
      </div>
    </div>
  </div>
);


};

export default Login;
