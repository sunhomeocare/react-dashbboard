import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import "./index.css";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
