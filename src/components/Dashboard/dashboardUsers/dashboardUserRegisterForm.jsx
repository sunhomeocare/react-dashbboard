import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormLabel, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUser } from "@/lib/helper/dashboardUsersHelper";
import { useQueryClient } from "@tanstack/react-query";
import { useUiStateStore } from "@/lib/store";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardUserRegisterForm() {
  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "user",
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const qC = useQueryClient();
  const setCreateDashboardUserSheetOpened = useUiStateStore((state) => state.setCreateDashboardUserSheetOpened);

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 5000);
    }
  }, [message]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await createUser(data.username, data.password, data.role);

      if (!result.status) {
        setMessage(result.message);
        return;
      }

      //revalidate the getDashboardUsers query and close the sheet.
      //invalidateQuereies - will trigger a refetch of the data.
      qC.invalidateQueries({
        queryKey: ["getDashboardUsers"],
      });

      setCreateDashboardUserSheetOpened(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper mt-12 flex flex-col gap-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} ref={field.ref}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Create User</Button>
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
