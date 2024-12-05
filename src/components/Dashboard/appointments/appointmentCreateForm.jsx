//CORE
import React, { useEffect, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//QUERIES
import { useGetDoctors } from "@/lib/services/queries/getDoctorsQuery";
import { useGetPatientDetail } from "@/lib/services/queries/patientDetailsQuery";
import { useGetTimeSlots } from "@/lib/services/queries/getTimeSlotQuery";

//STORE
import { useUiStateStore } from "@/lib/store";

//HELPERS
import { createAppointment, updateAppointment } from "@/lib/helper/appointmentHelper";

//HOOKS
import useDebounce from "@/hooks/useDebouce";

//SCHEMA
import { appointmentRegisterFormSchema } from "@/lib/schema";

//UI-COMPONENTS
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormLabel, FormControl, FormField, FormItem, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

//UTILS
import moment from "moment";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

//ICONS
import { Check, ChevronsUpDown, Calendar as CalendarIcon } from "lucide-react";
import { ExclamationTriangleIcon, Cross2Icon } from "@radix-ui/react-icons";
import { isDoctorAvail } from "@/lib/helper/doctorUnavailHelper";

export default function AppointmentCreateForm() {
  //STATE
  const setAppointmentsSheet = useUiStateStore((state) => state.setAppointmentsSheet);
  const appointmentsSheetAction = useUiStateStore((state) => state.appointmentsSheetAction);
  const updateAppointmentsData = useUiStateStore((state) => state.updateAppointmentsData);
  const restoreUpdateAppointmentsData = useUiStateStore((state) => state.restoreUpdateAppointmentsData);
  const restoreAppointmentsSheetAction = useUiStateStore((state) => state.restoreAppointmentsSheetAction);

  const [searchPhoneNumber, setSearchPhoneNumber] = useState("");
  const debouncedValue = useDebounce(searchPhoneNumber, 700);
  const [selectedDate, setSelectedDate] = useState("");
  const [dayType, setDayType] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const disabledDays = useMemo(() => {
    return {
      before: moment().startOf("day").toDate(), // Start of today
      after: moment().add(30, "days").endOf("day").toDate(), // End of the 30th day from today
    };
  }, []);
  const [doctorUnavail, setDoctorUnavail] = useState(false);

  const defaultValues = useMemo(() => {
    switch (appointmentsSheetAction) {
      case "create":
        return {
          doctorId: "-1",
          dateOfAppointment: null,
          user_id: 0,
          time_slot: "-1",
          reasonForVisit: "",
        };
      case "update":
        return {
          doctorId: updateAppointmentsData?.doctor_details.id.toString() || "-1",
          dateOfAppointment: new Date(updateAppointmentsData?.date) || null,
          user_id: updateAppointmentsData?.patient_details.id || 0,
          time_slot: updateAppointmentsData?.time_slots.id.toString() || "-1",
          reasonForVisit: updateAppointmentsData?.reason || "",
        };
      default:
        return {
          doctorId: "-1",
          dateOfAppointment: null,
          user_id: 0,
          time_slot: "-1",
          reasonForVisit: "",
        };
    }
  }, [appointmentsSheetAction]);

  //QUERIES
  const getDoctorsQuery = useGetDoctors(); //to fetch the doctors.
  const getPatientDetailsQuery = useGetPatientDetail(debouncedValue); //to fetch the data.
  const getTimeSlotsQuery = useGetTimeSlots(selectedDate, dayType);
  const qC = useQueryClient();

  //UTILITIES
  const form = useForm({
    resolver: zodResolver(appointmentRegisterFormSchema),
    defaultValues: defaultValues,
  });
  const { toast } = useToast();
  const { watch } = form;
  const dateOfAppointmentWatch = watch("dateOfAppointment");

  //USE-EFFECTS
  useEffect(() => {
    console.error({ updateAppointmentsData });
    if (appointmentsSheetAction === "update") {
      setSearchPhoneNumber(updateAppointmentsData.patient_details.Users.phoneNumber);
    }
  }, [appointmentsSheetAction]);

  useEffect(() => {
    if (dateOfAppointmentWatch !== null) {
      //check doctor availability once the date is selected/changed.
      checkDoctorAvailability(form.getValues().doctorId, moment(dateOfAppointmentWatch).format("YYYY-MM-DD"));

      const isSunday = moment(dateOfAppointmentWatch).format("e") === "0";
      setSelectedDate(moment(dateOfAppointmentWatch).format("YYYY-MM-DD"));
      setDayType(isSunday ? 2 : 1);
    }
  }, [dateOfAppointmentWatch]);

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 5000);
    }
  }, [message]);

  //HELPER FUNCTIONS
  const checkDoctorAvailability = async (id, date) => {
    if (!id || !date) return;

    try {
      setLoading(true);

      const result = await isDoctorAvail(id, date);

      if (!result.status) {
        setMessage(result.message);
        return;
      }

      setDoctorUnavail(!result.isAvail);
    } catch (error) {
      console.error(error);
      toast({
        title: "Create Action",
        description: "Error in creating the appointment",
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      //console.error({data});
      const payload = {
        ...data,
        dateOfAppointment: moment(data.dateOfAppointment).format("YYYY-MM-DD"),
      };

      const result = await createAppointment(payload);

      if (!result.status) {
        setMessage(result.message);
        return;
      }

      qC.invalidateQueries({
        queryKey: ["getAppointments"],
      });

      setAppointmentsSheet(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Create Action",
        description: "Error in creating the appointment",
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (data) => {
    try {
      setLoading(true);

      console.error(form.formState.dirtyFields);

      const changedValues = Object.keys(form.formState.dirtyFields).reduce((acc, key) => {
        let payloadKey;
        switch(key){
          case "doctorId":
            payloadKey = "doctor_id";
            break;
          case "user_id":
            payloadKey = "patient_id";
            break;
          case "time_slot":
            payloadKey = "slot_id";
            break;
          case "dateOfAppointment":
            payloadKey = "date";
            acc[payloadKey] = moment(data[key]).format("YYYY-MM-DD");
            return acc;
          case "reasonForVisit":
            payloadKey = "reason";
            break;
          default:
            payloadKey = key;
        }

        acc[payloadKey] = data[key];
        return acc;
      }, {});

      if(!Object.keys(changedValues).length){
        //there are no changes so throw a message and then return. 
        toast({
          title: "Update Action",
          description: "There were no changes, closing the update action.",
        });
        setAppointmentsSheet(false);
        return;
      }

      if(!updateAppointmentsData || !updateAppointmentsData.id) {
        setMessage("Internal Error - , try again later");
        return;
      }

      const result = await updateAppointment(updateAppointmentsData.id || null, changedValues);

      if(!result.status){
        console.error(result);
        setMessage("Internal Error - , try again later");
        return;
      }

      qC.invalidateQueries({
        queryKey: ["getAppointments"],
      });

      restoreAppointmentsSheetAction();
      restoreUpdateAppointmentsData();
      setAppointmentsSheet(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorName = (id) => {
    if (!id || id === "-1") {
      return "Select Doctor";
    }

    return getDoctorsQuery.data ? getDoctorsQuery.data.find((doctor) => doctor.id.toString() === id)?.name : "";
  };

  const getTimeSlotTitle = (id) => {
    if (!id || id === "-1") {
      return "Select Time Slot";
    }

    return getTimeSlotsQuery.data ? getTimeSlotsQuery.data.find((timeSlot) => timeSlot.id.toString() === id)?.display_text : "";
  };

  const getSelectedTitle = (value) => {
    const selectedUser = (getPatientDetailsQuery.data ?? []).find((ruser) => ruser.id === value);
    if (!selectedUser) return "Select User";
    return `${selectedUser.name} - ${selectedUser.Users.phoneNumber}`;
  };

  return (
    <div className="form-wrapper mt-12 flex flex-col gap-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(appointmentsSheetAction === "create"? onSubmit: onUpdate)} className="flex flex-col gap-y-8">
          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <div className="flex flex-col">
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} ref={field.ref}>
                    <FormControl>
                      <SelectTrigger disabled={getDoctorsQuery.isLoading}>
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
                {getDoctorsQuery.isLoading ? <p className="text-primary text-base font-semibold">Loading...</p> : null}
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <div className="flex flex-col">
                <FormItem className="flex flex-col">
                  <FormLabel>Patient</FormLabel>
                  <div className="flex flex-row w-full justify-between gap-x-4 items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" role="combobox" className={cn("justify-between w-full", !field.value && "text-muted-foreground")}>
                            {field.value ? getSelectedTitle(field.value) : "Select Patient"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command shouldFilter={false}>
                          <CommandInput placeholder="Search Users..." className="h-9" value={searchPhoneNumber} onValueChange={setSearchPhoneNumber} />
                          <CommandList>
                            {getPatientDetailsQuery.isLoading ? (
                              <div className="py-6 text-center text-sm">Fetching...</div>
                            ) : (
                              <>
                                <CommandGroup heading="Suggestions">
                                  {getPatientDetailsQuery.data?.map((patient) => {
                                    return (
                                      <CommandItem
                                        value={patient.id}
                                        key={`user-${patient.id}`}
                                        onSelect={() => {
                                          form.setValue("user_id", patient.id);
                                        }}
                                      >
                                        {patient.name} - {patient.Users.phoneNumber}
                                        <Check className={cn("ml-auto", patient.id === field.value ? "opacity-100" : "opacity-0")} />
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

                  <FormDescription>Search with the registered user phone number</FormDescription>
                  <FormMessage />
                </FormItem>
                {getPatientDetailsQuery.isLoading ? <p className="text-primary text-base font-semibold">Loading...</p> : null}
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfAppointment"
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
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(e) => {
                        field.onChange(e);
                        form.setValue("time_slot", "-1");
                      }}
                      disabled={disabledDays}
                      initialFocus
                      required
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Appointment will be scheduled on the selected date</FormDescription>
                {doctorUnavail ? (
                  <p className="text-[0.8rem] font-medium text-destructive">{getDoctorName(form.getValues().doctorId)} isn't available on the selected date</p>
                ) : null}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time_slot"
            render={({ field }) => (
              <div className="flex flex-col">
                <FormItem>
                  <FormLabel>Time Slot</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} ref={field.ref}>
                    <FormControl>
                      <SelectTrigger disabled={getTimeSlotsQuery.isLoading}>
                        <SelectValue placeholder="Select Time Slot">{getTimeSlotTitle(field.value)}</SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(getTimeSlotsQuery.data ?? []).map((timeSlot) => {
                        return (
                          <SelectItem key={timeSlot.id} value={timeSlot.id} disabled={timeSlot.disabled}>
                            {timeSlot.display_text}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
                {getTimeSlotsQuery.isLoading ? <p className="text-primary text-base font-semibold">Loading...</p> : null}
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="reasonForVisit"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Reason for visit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={getDoctorsQuery.isLoading || getTimeSlotsQuery.isLoading || doctorUnavail}>
              {appointmentsSheetAction === "create" ? "Create Appointment" : "Update Appointment"}
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
