import React from "react";
import FirstRow from "./firstRow";
import ThirdRow from "./thridRow";
import SecondRow from "./secondRow";

export default function Dashboard() {
  const data = {
    totalAppointments: {
      value: 6370,
      trendingUp: true,
      percentage: "10.2",
    },
    totalRegisteredMobileUsers: {
      value: 5560,
      trendingUp: false,
      percentage: "8.5",
    },
    totalPatientRecords: {
      value: 15560,
      trendingUp: true,
      percentage: "25.7",
    },
    appointmentsTrend: [
      { month: "January", appointments: 186 },
      { month: "February", appointments: 305 },
      { month: "March", appointments: 237 },
      { month: "April", appointments: 73 },
      { month: "May", appointments: 209 },
      { month: "June", appointments: 214 },
    ],
    modeOfBooking: [{
      "online": 2830,
      "walkin": 3540
    }],
    overallRating: {
      rating: 4.5,
      noOfReviews: 1245
    }
  };

  return (
    <div className="w-full p-4 m-auto grid gap-4 grid-rows-5">
      <FirstRow data={data} />
      <SecondRow data={data} />
      <ThirdRow data={data} />
    </div>
  );
}
