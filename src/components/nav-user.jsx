import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUserDetailsStore } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";
import AlertModal from "./alertModal";

export function NavUser({
  user
}) {
  const { isMobile } = useSidebar()
  const username = useUserDetailsStore((state) => state.username);
  const role = useUserDetailsStore((state) => state.role);
  const removeUser = useUserDetailsStore((state) => state.removeUser);
  const navigate = useNavigate({from: '/dashboard'});
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const logoutUser = () => {
    removeUser();
    localStorage.removeItem("auth_token");
    navigate({to: "/"})
  }

  return (
    (<SidebarMenu>
      <AlertModal 
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        title={"Logout"}
        description={"Are you sure you want to Logout?"}
        actionHandler={logoutUser}
      />
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={username} />
                <AvatarFallback className="rounded-lg text-black">{username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{username}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={username} />
                  <AvatarFallback className="rounded-lg">{username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{username}</span>
                </div>
                <div className="p-2 px-4 border border-dashed rounded-xl">
                  <p className="truncate font-light text-xs">{role.toUpperCase()}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate({to: "/dashboard/account"})}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLogoutModalOpen(true)}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>)
  );
}
