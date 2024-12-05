import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from '@tanstack/react-router';
import { useLocation } from "@tanstack/react-router";

export function NavGeneral({
  general
}) {
  const location = useLocation();
  const { isMobile } = useSidebar();
  return (
    (<SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        {general.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild isActive={location.pathname === item.url}>
              <Link to={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>)
  );
}
