import { useState, useMemo } from "react";
import { BookOpen, Bot, GalleryVerticalEnd, Settings2, SquareTerminal, Users, Rss, ListTodo, BriefcaseMedical, LayoutDashboard } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavGeneral } from "./nav-general";
import { useUserDetailsStore } from "@/lib/store";
import sunLogo from "@/assets/logo.jpg";

export function AppSidebar({ ...props }) {
  const role = useUserDetailsStore((state) => state.role);
  const sidebarData = useMemo(() => {
    const data = {
      user: {
        name: "",
        avatar: "",
      },
      teams: [
        {
          name: "Sun Homeocare",
          logo: sunLogo,
        },
      ],
      navMain: [
        {
          title: "Appointments",
          url: "#",
          icon: ListTodo,
          items: [
            {
              title: "Details",
              url: "/dashboard/appointments",
            },
            {
              title: "Ratings",
              url: "/dashboard/appointment-ratings",
            },
          ],
        },
        {
          title: "Users",
          url: "#",
          icon: SquareTerminal,
          items: [
            {
              title: "Registered Users",
              url: "/dashboard/registered-users",
            },
            {
              title: "Patients Details",
              url: "/dashboard/patient-users",
            },
          ],
        },
        {
          title: "Doctors",
          url: "#",
          icon: BriefcaseMedical,
          items: [
            {
              title: "Details",
              url: "/dashboard/doctors-details",
            },
            {
              title: "Unavailability",
              url: "/dashboard/doctors-availability",
            }
          ],
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
          items: [
            {
              title: "General",
              url: "#",
            },
            {
              title: "Team",
              url: "#",
            },
            {
              title: "Billing",
              url: "#",
            },
            {
              title: "Limits",
              url: "#",
            },
          ],
        },
      ],
      projects: [
        {
          name: "Appointments",
          url: "/dashboard/appointments",
          icon: ListTodo,
        },
        {
          name: "Hospital Updates",
          url: "/dashboard/news-management",
          icon: Rss,
        },
      ],
    };
    if (role === "admin") {
      return {
        ...data,
        general: [
          {
            name: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
          },
          {
            name: "Manage Portal Users",
            url: "/dashboard/dashboard-users",
            icon: Users,
          },
          {
            name: "Hospital Updates",
            url: "/dashboard/news-management",
            icon: Rss,
          },
        ],
      };
    } else {
      return {
        ...data,
        general: [
          {
            name: "Dashboard",
            url: "/dashboard/",
            icon: LayoutDashboard,
          },
        ],
      };
    }
  }, [role]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavGeneral general={sidebarData.general} />
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
