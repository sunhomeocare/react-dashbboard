import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <div className="app-wrapper bg-background flex-1 h-dvh">
      <Outlet />
    </div>
  )
}

export default App;
