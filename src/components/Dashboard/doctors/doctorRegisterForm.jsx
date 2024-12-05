import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorRegisterFormSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormLabel, FormControl, FormField, FormItem, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useUiStateStore } from "@/lib/store";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createDoctor, updateDoctor } from "@/lib/helper/doctorHelper";

export default function DoctorRegisterForm() {
  const setCreateDoctorsSheetOpened = useUiStateStore((state) => state.setCreateDoctorsSheetOpened);
  const doctorSheetAction = useUiStateStore((state) => state.doctorSheetAction);
  const updateDoctorData = useUiStateStore((state) => state.updateDoctorData);
  const restoreUpdateDoctorData = useUiStateStore((state) => state.restoreUpdateDoctorData);
  const restoreDoctorSheetAction = useUiStateStore((state) => state.restoreDoctorSheetAction);
  const { toast } = useToast();

  const defaultValues = useMemo(() => {
    switch (doctorSheetAction) {
      case "create":
        return {
          name: "",
          designation: "",
          branch: "Visakhapatnam",
          experience: "",
          available_time: "",
          available_date: "",
        };
      case "update":
        return {
          name: updateDoctorData?.name || "",
          designation: updateDoctorData?.designation || "",
          branch: updateDoctorData?.branch || "Visakhapatnam",
          experience: updateDoctorData?.experience || "",
          available_time: updateDoctorData?.available_time || "",
          available_date: updateDoctorData?.available_date || "",
        };
      default:
        return {
          name: "",
          designation: "",
          branch: "Visakhapatnam",
          experience: "",
          available_time: "",
          available_date: "",
        };
    }
  }, [doctorSheetAction]);

  const form = useForm({
    resolver: zodResolver(doctorRegisterFormSchema),
    defaultValues: defaultValues,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const qC = useQueryClient();

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 5000);
    }
  }, [message]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let payload = {
        ...data,
        available_time: data.available_time?.trim().toUpperCase(),
        available_date: data.available_date?.trim().toUpperCase(),
      };
      const result = await createDoctor(payload);

      if (!result.status) {
        setMessage(result.message);
        return;
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      return;
    } finally {
      setLoading(false);

      //revalidate the getAllDoctors query and close the sheet.
      //invalidateQuereies - will trigger a refetch of the data.
      qC.invalidateQueries({
        queryKey: ["getAllDoctors"],
      });

      restoreDoctorSheetAction();
      restoreUpdateDoctorData();
      setCreateDoctorsSheetOpened(false);
    }
  };

  const onUpdate = async (data) => {
    try {
      setLoading(true);

      const changedValues = Object.keys(form.formState.dirtyFields).reduce((acc, key) => {
        if(key === "available_time" || key === "available_date") {
          acc[key] = data[key]?.trim().toUpperCase();
          return acc;
        }
        acc[key] = data[key];
        return acc;
      }, {});

      if(!Object.keys(changedValues).length){
        //there are no changes so throw a message and then return. 
        toast({
          title: "Update Action",
          description: "There were no changes, closing the update action.",
        });
  
        return;
      }

      if(!updateDoctorData || !updateDoctorData.id) {
        setMessage("Internal Error - , try again later");
        return;
      }

      const result = await updateDoctor(updateDoctorData.id || null, changedValues);


      if(!result.status){
        console.error(result.message);
        setMessage("Internal Error - , try again later");
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);

      //revalidate the getAllDoctors query and close the sheet.
      //invalidateQuereies - will trigger a refetch of the data.
      qC.invalidateQueries({
        queryKey: ["getAllDoctors"],
      });

      restoreDoctorSheetAction();
      restoreUpdateDoctorData();
      setCreateDoctorsSheetOpened(false);
    }
  }

  return (
    <div className="form-wrapper mt-12 flex flex-col gap-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(doctorSheetAction === "create" ? onSubmit: onUpdate)} className="flex flex-col gap-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Doctor Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Designation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} ref={field.ref}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Visakhapatnam">Visakhapatnam</SelectItem>
                    <SelectItem value="Vijayawada">Vijayawada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" placeholder="Experience" {...field} />
                </FormControl>
                <FormDescription>Enter your years of experience in number ex: 10 </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="available_time"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Available Time" {...field} />
                </FormControl>
                <FormDescription>This would be your general avilable hours. ex: 9 AM - 7 PM </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="available_date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Available Days" {...field} />
                </FormControl>
                <FormDescription>This would be your general avilable days. ex: MON - SAT </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">{doctorSheetAction === "create" ? "Create Profile" : "Update Profile"}</Button>
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
