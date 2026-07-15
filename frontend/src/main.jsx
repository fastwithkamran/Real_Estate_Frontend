import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router";

import {
  Signup,
  Login,
  Home,
  CreateProperty,
  PropertyPage,
  Settings,
  AllPosts,
} from "./pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/user/create-property" element={<CreateProperty />} />
      <Route path="/user/property-page/:id" element={<PropertyPage />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/user/settings/:userId" element={<Settings />} />
      <Route path="/user/allposts/:userId" element={<AllPosts />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
