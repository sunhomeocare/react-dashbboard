import React, { useEffect, useState, useMemo} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registeredUserFormSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormLabel, FormControl, FormField, FormItem, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useUiStateStore } from "@/lib/store";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createRegisteredUser, updateRegisteredUser } from "@/lib/helper/registeredUserHelper";

export default function CreateRegisteredUserForm() {
  const setCreateRegisteredUserSheetOpened = useUiStateStore((state) => state.setCreateRegisteredUserSheetOpened);
  const registeredUserSheetAction = useUiStateStore((state) => state.registeredUserSheetAction);
  const updateRegisteredUserData = useUiStateStore((state) => state.updateRegisteredUserData);
  const restoreUpdateRegisteredUserData = useUiStateStore((state) => state.restoreUpdateRegisteredUserData);
  const restoreRegisteredUserSheetAction = useUiStateStore((state) => state.restoreRegisteredUserSheetAction);
  const { toast } = useToast();

  const defaultValues = useMemo(() => {
    switch (registeredUserSheetAction) {
      case "create":
        return {
          name: "",
          age: null,
          gender: "Male",
          phoneNumber: ""
        };
      case "update":
        return {
          name: updateRegisteredUserData?.displayName || "",
          age: updateRegisteredUserData?.age.toString() || null,
          gender: (updateRegisteredUserData?.gender ? "Male": "Female")  || "Male",
          phoneNumber: updateRegisteredUserData?.phoneNumber || "",
        };
      default:
        return {
          name: "",
          age: null,
          gender: "Male",
          phoneNumber: ""
        };
    }
  }, [registeredUserSheetAction]);

  const form = useForm({
    resolver: zodResolver(registeredUserFormSchema),
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
        const payload = {
            ...data,
            gender: data.gender === "Male"
        }

        const result = await createRegisteredUser(payload);

        if (!result.status) {
            setMessage(result.message);
            return;
        }

        qC.invalidateQueries({
            queryKey: ["getRegisteredUsers"],
        });
        setCreateRegisteredUserSheetOpened(false);
    } catch (error) {
        console.error(error);
        toast({
            title: "Create Action",
            description: "Error in creating the user",
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
        if(key === "gender"){
          acc[key] = data[key] === "Male";
          return acc;
        }

        if(key === "name"){
          acc["displayName"] = data[key];
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
        setCreatePatientSheetOpened(false);
        return;
      }

      if(!updateRegisteredUserData || !updateRegisteredUserData.id) {
        setMessage("Internal Error - , try again later");
        return;
      }

      const result = await updateRegisteredUser(updateRegisteredUserData.id || null, changedValues);

      if(!result.status){
        console.error(result);
        setMessage("Internal Error - , try again later");
        return;
      }

      qC.invalidateQueries({
        queryKey: ["getRegisteredUsers"],
      });

      restoreRegisteredUserSheetAction();
      restoreUpdateRegisteredUserData();
      setCreateRegisteredUserSheetOpened(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-wrapper mt-12 flex flex-col gap-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(registeredUserSheetAction === "create" ? onSubmit: onUpdate)} className="flex flex-col gap-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" placeholder="Age" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} ref={field.ref}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={"Male"}>Male</SelectItem>
                    <SelectItem value={"Female"}>Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Phonenumber" {...field} />
                </FormControl>
                <FormDescription>Enter your 10 digit phone number without +91 </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">
              {registeredUserSheetAction === "create" ? "Create User" : "Update User"}
            </Button>
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
