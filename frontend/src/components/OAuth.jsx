import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { toast } from "react-hot-toast";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router";

function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const response = await fetch("/api/user/google", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          fullName: result.user.displayName,
          email: result.user.email,
          avator: result.user.photoURL,
        }),
      });
      const data = await response.json();
      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      if (import.meta.env.VITE_ERROR === "development") console.error(error);
      toast.error("Error failed to fetch API request");
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white p-3 flex-nowrap rounded-lg uppercase hover:opacity-65"
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
