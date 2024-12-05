import { createFileRoute } from "@tanstack/react-router";
import NewsManagement from "@/components/Dashboard/news/newsManagement";

export const Route = createFileRoute("/dashboard/_dashLayout/news-management")({
  component: NewsManagement,
});
