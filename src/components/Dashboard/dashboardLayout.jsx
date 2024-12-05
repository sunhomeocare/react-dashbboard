import React, { useMemo } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import { dashboard_paths } from "./data";

export default function DashboardLayout() {
  const location = useLocation();
  const breadCrumbList = useMemo(() => {
    switch (location.pathname) {
      case dashboard_paths.account:
        return [
          {
          value: "Account",
          isLink: false,
        },
      ];
      case dashboard_paths.dashboard:
        return [
          {
            value: "General",
            isLink: false,
          },
          {
            value: "Dashboard",
            isLink: false,
          },
        ];
      case dashboard_paths.dashboardUsers:
        return [
          {
            value: "General",
            isLink: false,
          },
          {
            value: "Manage Portal Users",
            isLink: false,
          },
        ];
      case dashboard_paths.doctorsDetails:
        return [
          {
            value: "Core",
            isLink: false,
          },
          {
            value: "Doctors",
            isLink: false,
          },
          {
            value: "Details",
            isLink: false,
          },
        ];
      case dashboard_paths.doctorAvailability:
        return [
          {
            value: "Core",
            isLink: false,
          },
          {
            value: "Doctors",
            isLink: false,
          },
          {
            value: "Availability",
            isLink: false,
          },
        ];
      case dashboard_paths.newsManagement:
        return [
          {
            value: "General",
            isLink: false,
          },
          {
            value: "Hospital Updates",
            isLink: false,
          },
        ];
      case dashboard_paths.patientDetails:
        return [
          {
            value: "Core",
            isLink: false,
          },
          {
            value: "Users",
            isLink: false,
          },
          {
            value: "Patients Details",
            isLink: false,
          },
        ];
      case dashboard_paths.registeredUsers:
        return [
          {
            value: "Core",
            isLink: false,
          },
          {
            value: "Users",
            isLink: false,
          },
          {
            value: "Registered Users",
            isLink: false,
          },
        ];
        case dashboard_paths.appointments:
          return [
            {
              value: "Core",
              isLink: false,
            },
            {
              value: "Appointments",
              isLink: false,
            },
            {
              value: "Details",
              isLink: false,
            }
          ];
          case dashboard_paths.appointmentRatings:
            return [
              {
                value: "Core",
                isLink: false,
              },
              {
                value: "Appointments",
                isLink: false,
              },
              {
                value: "Ratings",
                isLink: false,
              }
            ];
      default:
        return [];
    }
  }, [location]);
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadCrumbList.map((breadCrumb, index) => {
                  if (index === breadCrumbList.length - 1) {
                    return (
                      <BreadcrumbItem key={index}>
                        <BreadcrumbPage>{breadCrumb.value}</BreadcrumbPage>
                      </BreadcrumbItem>
                    );
                  }

                  return (
                    <React.Fragment key={index}>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbPage>{breadCrumb.value}</BreadcrumbPage>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="dashboard-content-wrapper flex flex-1 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
