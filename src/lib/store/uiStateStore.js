import { create } from "zustand";

export const useUiStateStore = create((set) => ({
  createDashboardUserSheetOpened: false,
  setCreateDashboardUserSheetOpened: (value) => set({ createDashboardUserSheetOpened: value }),

  //Registered Users Page
  createRegisteredUserSheetOpened: false,
  setCreateRegisteredUserSheetOpened: (value) => set({ createRegisteredUserSheetOpened: value }),

  registeredUserSheetAction: "create", //values - create, update
  setRegisteredUserSheetAction: (value) => set({ registeredUserSheetAction: value }),
  restoreRegisteredUserSheetAction: () => set({ registeredUserSheetAction: "create" }),

  updateRegisteredUserData: {},
  setUpdateRegisteredUserData: (value) => set({ updateRegisteredUserData: value }),
  restoreUpdateRegisteredUserData: () => set({ updateRegisteredUserData: {} }),

  //Patients Page
  createPatientSheetOpened: false,
  setCreatePatientSheetOpened: (value) => set({ createPatientSheetOpened: value }),

  createPatientSheetAction: "create", //values - create, update
  setCreatePatientSheetAction: (value) => set({ createPatientSheetAction: value }),
  restoreCreatePatientSheetAction: () => set({ createPatientSheetAction: "create" }),

  updateCreatePatientData: {},
  setUpdateCreatePatientData: (value) => set({ updateCreatePatientData: value }),
  restoreUpdateCreatePatientData: () => set({ updateCreatePatientData: {} }),

  //Doctor Page
  createDoctorsSheetOpened: false,
  setCreateDoctorsSheetOpened: (value) => set({ createDoctorsSheetOpened: value }),

  doctorSheetAction: "create", //values - create, update
  setDoctorSheetAction: (value) => set({ doctorSheetAction: value }),
  restoreDoctorSheetAction: () => set({ doctorSheetAction: "create" }),

  updateDoctorData: {},
  setUpdateDoctorData: (value) => set({ updateDoctorData: value }),
  restoreUpdateDoctorData: () => set({ updateDoctorData: {} }),

  //Doctor Availability Page
  doctorUnavailSheet: false,
  setDoctorUnavailSheet: (value) => set({ doctorUnavailSheet: value }),

  //Appointments Page
  appointmentsSheet: false,
  setAppointmentsSheet: (value) => set({ appointmentsSheet: value }),

  appointmentsSheetAction: "create", //values - create, update
  setAppointmentsSheetAction: (value) => set({ appointmentsSheetAction: value }),
  restoreAppointmentsSheetAction: () => set({ appointmentsSheetAction: "create" }),

  updateAppointmentsData: {},
  setUpdateAppointmentsData: (value) => set({ updateAppointmentsData: value }),
  restoreUpdateAppointmentsData: () => set({ updateAppointmentsData: {} }),

  //News Page
  newsSheet: false,
  setNewsSheet: (value) => set({ newsSheet: value }),

  newsSheetAction: "create", //values - create, update
  setNewsSheetAction: (value) => set({ newsSheetAction: value }),
  restoreNewsSheetAction: () => set({ newsSheetAction: "create" }),

  updateNewsData: {},
  setUpdateNewsData: (value) => set({ updateNewsData: value }),
  restoreUpdateNewsData: () => set({ updateNewsData: {} }),
}));
