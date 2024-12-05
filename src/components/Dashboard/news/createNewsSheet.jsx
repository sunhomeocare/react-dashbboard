import React, { useMemo } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUiStateStore } from "@/lib/store";
import NewsCreateForm from "./newsCreateForm";

export default function CreateNewsSheet() {
  const newsSheet = useUiStateStore((state) => state.newsSheet);
  const setNewsSheet = useUiStateStore((state) => state.setNewsSheet);
  const newsSheetAction = useUiStateStore((state) => state.newsSheetAction);

  const sheetValues = useMemo(() => {
    switch (newsSheetAction) {
      case "create":
        return {
          title: "Add News",
          description: "This news will be showecased in the mobile app",
        };
      case "update":
        return {
          title: "Update News",
          description: "You can update existing new's details",
        };
      default:
        return {
          title: "Add News",
          description: "This news will be showecased in the mobile app",
        };
    }
  }, [newsSheetAction]);

  return (
    <Sheet open={newsSheet} onOpenChange={setNewsSheet}>
      <SheetContent side="right" className="w-[30vw] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>{sheetValues.title}</SheetTitle>
          <SheetDescription>{sheetValues.description}</SheetDescription>
        </SheetHeader>
        <NewsCreateForm />
      </SheetContent>
    </Sheet>
  );
}
