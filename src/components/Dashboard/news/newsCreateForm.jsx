import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormLabel, FormDescription, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { useUiStateStore } from "@/lib/store";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import newsFormSchema from "@/lib/schema/newsFormSchema";
import { createNews, updateNews } from "@/lib/helper/newsHelper";

export default function NewsCreateForm() {
  const setNewsSheet = useUiStateStore((state) => state.setNewsSheet);
  const newsSheetAction = useUiStateStore((state) => state.newsSheetAction);
  const updateNewsData = useUiStateStore((state) => state.updateNewsData);
  const restoreUpdateNewsData = useUiStateStore((state) => state.restoreUpdateNewsData);
  const restoreNewsSheetAction = useUiStateStore((state) => state.restoreNewsSheetAction);

  const defaultValues = useMemo(() => {
    switch (newsSheetAction) {
      case "create":
        return {
          title: "",
          content: "",
          image: "",
        };
      case "update":
        return {
          title: updateNewsData?.title || "",
          content: updateNewsData?.content || "",
          image: updateNewsData?.image_url || "",
        };
      default:
        return {
          title: "",
          content: "",
          image: "",
        };
    }
  }, [newsSheetAction]);

  const form = useForm({
    resolver: zodResolver(newsFormSchema),
    defaultValues: defaultValues
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const qC = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 5000);
    }
  }, [message]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const result = await createNews(data);

      if (!result.status) {
        setMessage(result.message);
        return;
      }

      qC.invalidateQueries({
        queryKey: ["getNews"],
      });

      setNewsSheet(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Create Action",
        description: "Error in creating the news",
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (data) => {
    try {
      setLoading(true);

      const changedValues = Object.keys(form.formState.dirtyFields).reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});

      if (!Object.keys(changedValues).length) {
        //there are no changes so throw a message and then return.
        toast({
          title: "Update Action",
          description: "There were no changes, closing the update action.",
        });
        setNewsSheet(false);
        return;
      }

      if (!updateNewsData || !updateNewsData.id) {
        setMessage("Internal Error - , try again later");
        return;
      }

      const result = await updateNews(updateNewsData.id || null, changedValues);

      if (!result.status) {
        console.error(result);
        setMessage("Internal Error - , try again later");
        return;
      }

      qC.invalidateQueries({
        queryKey: ["getNews"],
      });

      restoreNewsSheetAction();
      restoreUpdateNewsData();
      setNewsSheet(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper mt-12 flex flex-col gap-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(newsSheetAction === "create" ? onSubmit : onUpdate)} className="flex flex-col gap-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      field.onChange(file); // Pass the file object to React Hook Form
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea className="resize-none h-[200px]" placeholder="Enter your content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">{newsSheetAction === "create" ? "Add News" : "Update News"}</Button>
          </div>
        </form>
      </Form>
      {message ? (
        <div>
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </div>
      ) : null}
    </div>
  );
}
