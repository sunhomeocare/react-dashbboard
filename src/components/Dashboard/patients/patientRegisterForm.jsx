import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormLabel, FormControl, FormField, FormItem, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useUiStateStore } from "@/lib/store";
import { createPatient, updatePatient } from "@/lib/helper/patientHelper";
import { ExclamationTriangleIcon, Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import useDebounce from "@/hooks/useDebouce";
import { useToast } from "@/hooks/use-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetRegisteredUser } from "@/lib/services/queries/registeredUsersQuery";

export default function CreatePatientForm() {
  //STATE
  const setCreatePatientSheetOpened = useUiStateStore((state) => state.setCreatePatientSheetOpened);
  const createPatientSheetAction = useUiStateStore((state) => state.createPatientSheetAction);
  const updateCreatePatientData = useUiStateStore((state) => state.updateCreatePatientData);
  const restoreUpdateCreatePatientData = useUiStateStore((state) => state.restoreUpdateCreatePatientData);
  const restoreCreatePatientSheetAction = useUiStateStore((state) => state.restoreCreatePatientSheetAction);

  const [searchPhoneNumber, setSearchPhoneNumber] = useState("");
  const debouncedValue = useDebounce(searchPhoneNumber, 700);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const defaultValues = useMemo(() => {
    switch (createPatientSheetAction) {
      case "create":
        return {
          name: "",
          age: null,
          gender: "Male",
          phoneNumber: "",
          address: "",
          user_id: 0,
        };
      case "update":
        return {
          name: updateCreatePatientData?.name || "",
          age: updateCreatePatientData?.age.toString() || null,
          gender: (updateCreatePatientData?.gender ? "Male" : "Female") || "Male",
          phoneNumber: updateCreatePatientData?.phoneNumber || "",
          address: updateCreatePatientData?.address || "",
          user_id: updateCreatePatientData?.Users.id || 0,
        };
      default:
        return {
          name: "",
          age: null,
          gender: "Male",
          phoneNumber: "",
          address: "",
          user_id: 0,
        };
    }
  }, [createPatientSheetAction]);

  //QUERIES
  const getRegisteredUser = useGetRegisteredUser(debouncedValue);
  const qC = useQueryClient();

  //UTILITIES
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(patientFormSchema),
    defaultValues: defaultValues,
  });

  //USE-EFFECTS
  useEffect(() => {
    if (createPatientSheetAction === "update") {
      // setting the phone number when it is update action.
      setSearchPhoneNumber(updateCreatePatientData.Users.phoneNumber);
    }
  }, [createPatientSheetAction]);

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 5000);
    }
  }, [message]);

  //Hanlder Functions
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        gender: data.gender === "Male",
      };

      const result = await createPatient(payload);

      if (!result.status) {
        setMessage(result.message);
        return;
      }

      qC.invalidateQueries({
        queryKey: ["getPatientDetails"],
      });

      setCreatePatientSheetOpened(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Create Action",
        description: "Error in creating the patient",
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
        
        acc[key] = data[key];
        return acc;
      }, {});

      if (!Object.keys(changedValues).length) {
        //there are no changes so throw a message and then return.
        toast({
          title: "Update Action",
          description: "There were no changes, closing the update action.",
        });
        setCreatePatientSheetOpened(false);
        return;
      }

      if (!updateCreatePatientData || !updateCreatePatientData.id) {
        setMessage("Internal Error - , try again later");
        return;
      }

      const result = await updatePatient(updateCreatePatientData.id || null, changedValues);

      if (!result.status) {
        console.error(result);
        setMessage("Internal Error - , try again later");
        return;
      }

      qC.invalidateQueries({
        queryKey: ["getPatientDetails"],
      });

      restoreCreatePatientSheetAction();
      restoreUpdateCreatePatientData();
      setCreatePatientSheetOpened(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedTitle = (value) => {
    const selectedUser = (getRegisteredUser.data ?? []).find((ruser) => ruser.id === value);
    if (!selectedUser) return "Select User";
    return `${selectedUser.displayName} - ${selectedUser.phoneNumber}`;
  };

  return (
    <div className="form-wrapper mt-12 flex flex-col gap-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createPatientSheetAction === "create" ? onSubmit : onUpdate)} className="flex flex-col gap-y-6">
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <div className="flex flex-col">
                <FormItem className="flex flex-col">
                  <div className="flex flex-row w-full justify-between gap-x-4 items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" role="combobox" className={cn("justify-between w-full", !field.value && "text-muted-foreground")}>
                            {field.value ? getSelectedTitle(field.value) : "Select Registered User"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command shouldFilter={false}>
                          <CommandInput placeholder="Search Users..." className="h-9" value={searchPhoneNumber} onValueChange={setSearchPhoneNumber} />
                          <CommandList>
                            {getRegisteredUser.isLoading ? (
                              <div className="py-6 text-center text-sm">Fetching...</div>
                            ) : (
                              <>
                                <CommandGroup heading="Suggestions">
                                  {getRegisteredUser.data?.map((ruser) => {
                                    return (
                                      <CommandItem
                                        value={ruser.id}
                                        key={`user-${ruser.id}`}
                                        onSelect={() => {
                                          form.setValue("user_id", ruser.id);
                                        }}
                                      >
                                        {ruser.displayName} - {ruser.phoneNumber}
                                        <Check className={cn("ml-auto", ruser.id === field.value ? "opacity-100" : "opacity-0")} />
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                                <CommandEmpty>No results found</CommandEmpty>
                              </>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {form.getValues().user_id ? (
                      <Button variant="ghost" onClick={() => form.setValue("user_id", 0)} className="h-8 px-2 lg:px-3">
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>

                  <FormDescription>New patient will be mapped with the selected registered user</FormDescription>
                  <FormMessage />
                </FormItem>
                {getRegisteredUser.isLoading ? <p className="text-primary text-base font-semibold">Loading...</p> : null}
              </div>
            )}
          />
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
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={getRegisteredUser.isLoading}>{createPatientSheetAction === "create" ? "Create Patient" : "Update Patient"}</Button>
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
