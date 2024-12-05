import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorUnavailFormSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Form, FormLabel, FormControl, FormField, FormItem, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetDoctors } from "@/lib/services/queries/getDoctorsQuery";
import moment from "moment";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createUnavail } from "@/lib/helper/doctorUnavailHelper";
import { useQueryClient } from "@tanstack/react-query";
import { useUiStateStore } from "@/lib/store";

export default function DoctorUnavailForm() {
  const form = useForm({
    resolver: zodResolver(doctorUnavailFormSchema),
    defaultValues: {
      doctorId: "-1",
      unavailDate: null,
    },
  });
  const getDoctorsQuery = useGetDoctors(); //to fetch the doctors.
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const qC = useQueryClient();
  const setDoctorUnavailSheet = useUiStateStore((state) => state.setDoctorUnavailSheet);
  const disabledDays = useMemo(() => {
    return {
      before: moment().startOf("day").toDate(), // Start of today
      after: moment().add(30, "days").endOf("day").toDate(), // End of the 30th day from today
    };
  }, []);

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 5000);
    }
  }, [message]);

  const onSubmit = async (data) => {
    const payload = {
        ...data,
        unavailDate: moment(data.unavailDate).format("YYYY-MM-DD")
    }
    try {
      setLoading(true);
      const result = await createUnavail(payload);
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
        queryKey: ["getAllDoctorsUnavailability"],
      });

      setDoctorUnavailSheet(false);
    }
  };

  const getDoctorName = (id) => {
    if (!id || id === "-1") {
      return "Select Doctor";
    }

    return getDoctorsQuery.data ? getDoctorsQuery.data.find((doctor) => doctor.id.toString() === id)?.name : "";
  };

  return (
    <div className="form-wrapper mt-12 flex flex-col gap-y-4">
      {getDoctorsQuery.isLoading ? (
        <div className="flex-1">
          <p className="text-primary text-base font-semibold">Loading...</p>
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} ref={field.ref}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor">{getDoctorName(field.value)}</SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(getDoctorsQuery.data ?? []).map((doctor) => {
                          return (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unavailDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? moment(field.value).format("Do MMM YYYY") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={disabledDays} initialFocus required />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Doctor's unavailability will be marked against this date.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Add Unavailability</Button>
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
        </>
      )}
    </div>
  );
}
