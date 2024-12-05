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

export function NavProjects({
  projects
}) {
  const { isMobile } = useSidebar();
  const location = useLocation();
  return (
    (<SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Actions</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild variant={"primary"} isActive={location.pathname === item.url}>
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
