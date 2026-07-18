import { Navbar } from "./components";
import { Footer } from "./components";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
      <div>
        <Toaster position="top-center" />
      </div>
      <div className="flex flex-col min-h-dvh w-full overflow-x-hidden bg-neutral-200">
        <nav className="mb-3">
          <Navbar />
        </nav>
        <main className="flex flex-col grow justify-center items-center p-auto">
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
