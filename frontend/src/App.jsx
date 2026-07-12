import { Navbar } from "./components";
import { Footer } from "./components";
import { Outlet, useLocation } from "react-router";
import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();
  const atHome = location.pathname === "/";
  const atPage = location.pathname === "/user/property-page";

  return (
    <>
      <div>
        <Toaster position="top-center" />
      </div>
      <div className="flex flex-col min-h-dvh w-full overflow-x-hidden bg-gray-200">
        <nav className="mb-3">
          <Navbar />
        </nav>
        <main
          className={
           `flex flex-col grow ${!atHome && !atPage} ?  "justify-center items-center p-auto" : ""`
          }
        >
          <Outlet />
        </main>
        <footer className="mt-3">
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default App;
