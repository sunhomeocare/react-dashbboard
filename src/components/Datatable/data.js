import { appointmentStatusKeys } from "@/lib/constants"

export const genderFilterValues = [
    {
        value: true,
        label: "Male"
    },
    {
        value: false,
        label: "Female"
    }
]

export const branchFilterValues = [
    {
        value: "Visakhapatnam",
        label: "Visakhapatnam"
    },
    {
        value: "Vijayawada",
        label: "Vijayawada"
    }
]

export const appointmentStatus = [
    {
        value: appointmentStatusKeys.scheduled,
        label: "SCHEDULED"
    },
    {
        value: appointmentStatusKeys.completed,
        label: "COMPLETED"
    },
    {
        value: appointmentStatusKeys.cancelled,
        label: "CANCELLED"
    }
]

export const dashboardUserRole = [
    {
        value: "admin",
        label: "Admin"
    },
    {
        value: "user",
        label: "User"
    }
]

export const patientUsersFilterColumns = [
    {
        value: "name",
        label: "Name"
    },
    {
        value: "age",
        label: "Age"
    },
    {
        value: "phoneNumber",
        label: "Patient Phonenumber"
    },
    {
        value: "address",
        label: "Address"
    },{
        value: "Users_displayName",
        label: "Created User"
    },
    {
        value: "Users_phoneNumber",
        label: "Created Phonenumber"
    }
]   

export const registeredUsersFilterColumns = [
    {
        value: "displayName",
        label: "Name"
    },
    {
        value: "age",
        label: "Age"
    },
    {
        value: "phoneNumber",
        label: "Patient Phonenumber"
    },
    {
        value: "created_at",
        label: "Created At"
    }
]  

export const doctorsFilterColumns = [
    {
        value: "name",
        label: "Name"
    },
    {
        value: "designation",
        label: "Designation"
    },
    {
        value: "experience",
        label: "Experience"
    },
    {
        value: "available_time",
        label: "Available Time"
    },
    {
        value: "available_date",
        label: "Available Day"
    }
] 

export const doctorsUnavailFilterColumns = [
    {
        value: "doctor_details_name",
        label: "Name"
    },
    {
        value: "doctor_details_branch",
        label: "Branch"
    }
] 

export const appointmentFilterColumns = [
    {
        value: "patient_details_name",
        label: "Patient Name"
    },
    {
        value: "time_slots_display_text",
        label: "Slot"
    },
    {
        value: "doctor_details_name",
        label: "Doctor Name"
    }
]