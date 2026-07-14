import { useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useState } from "react";
import apiFetch from "../../services/apiClient"

function Navbar() {
  const location = useLocation();
  const atHome = location.pathname === "/";
  const navigate = useNavigate();

  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleCheckAuthAndNavigate = async (event) => {
    try {
      const action = event.currentTarget.dataset.action;

      const response = await apiFetch(import.meta.env.VITE_AUTH_VERIFICATION_API, {
        credentials: "include",
        method: "GET",
      });

      const result = await response.json();

      if (response.ok) {
        if (action === "CreateAd") navigate("/user/create-property");
        else if (action === "Logout") {
          try {
            const response = await apiFetch(import.meta.env.VITE_LOGOUT_API,{
              method: "GET",
              credentials: "include",
            });
            const result = await response.json();
            if (response.ok) {
              navigate("/auth/login");
            } else {
              toast.error(`Error: ${result.msg}`);
              navigate("/");
            }
          } catch (error) {
            toast.error("Error failed to fetch API request");
          }
        } else if (action === "AllPosts") {
          try {
            const response = await apiFetch(import.meta.env.VITE_USERID, {
              method: "GET",
              credentials: "include",
            });

            const result = await response.json();
            
            if (response.ok) {
              navigate(`/user/allposts/${result}`);
            } else {
              toast.error(`Error: ${result.msg}`);
              navigate("/");
            }
          } catch (error) {
            toast.error("Error failed to fetch API request");
          }
        } else if (action === "Settings") {
          try {
            const response = await apiFetch(import.meta.env.VITE_USERID, {
              method: "GET",
              credentials: "include",
            });

            const result = await response.json();
            
            if (response.ok) {
              navigate(`/user/settings/${result}`);
            } else {
              toast.error(`Error: ${result.msg}`);
              navigate("/");
            }
          } catch (error) {
            toast.error("Error failed to fetch API request");
          }
        }
      } else {
        toast.error(`Error: ${result.msg}`);
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error("Error failed to fetch API request");
    }
  };

  return (
    <>
      <nav className="bg-blue-900 flex flex-row justify-between">
        <img src="/logo.png" alt="Logo" className="lg:w-1/6 w-1/4" />

        {atHome && (
          <>
            <div className="flex flex-row">
              <div className="relative inline-block">
                <button
                  className="border-2 border-amber-50 rounded-lg flex items-center p-2 mt-3 ml-3 mb-3 bg-blue-500 text-amber-50 cursor-pointer hover:bg-gray-500"
                  onClick={() => setMenuOpen(!isMenuOpen)}
                >
                  ☰
                </button>
                {isMenuOpen && (
                  <ul className="absolute bg-blue-50 cursor-pointer">
                    <li className="font-bold text-blue-800 p-2">
                      <button
                        data-action="Settings"
                        onClick={handleCheckAuthAndNavigate}
                      >
                        Settings
                      </button>
                    </li>
                    <hr />
                    <li className="font-bold whitespace-nowrap p-2 cursor-pointer">
                      <button
                        data-action="AllPosts"
                        onClick={handleCheckAuthAndNavigate}
                      >
                        Your Ads
                      </button>
                    </li>
                    <hr />
                    <li className="font-bold text-red-800 p-2 cursor-pointer">
                      <button
                        data-action="Logout"
                        onClick={handleCheckAuthAndNavigate}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
              <button
                className="border-2 border-amber-50 rounded-lg p-2 m-3 flex items-center bg-red-500 text-amber-50 cursor-pointer hover:bg-gray-500"
                data-action="CreateAd"
                onClick={handleCheckAuthAndNavigate}
              >
                Create
              </button>
            </div>
          </>
        )}
      </nav>
    </>
  );
}

export default Navbar;
