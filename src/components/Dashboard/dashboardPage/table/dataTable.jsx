import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import moment from 'moment';

export default function DashboardDataTable() {

    const invoices = [
        {
            date: "2024-11-23T14:30:19+05:30",
            noOfAppointments: "Full",
            doctorUnavailbility: 0
        },
        {
            date: "2024-11-24T14:30:19+05:30",
            noOfAppointments: 28,
            doctorUnavailbility: 2
        },
        {
            date: "2024-11-25T14:30:19+05:30",
            noOfAppointments: 15,
            doctorUnavailbility: 3
        },
        {
            date: "2024-11-26T14:30:19+05:30",
            noOfAppointments: 2,
            doctorUnavailbility: 0
        },
        {
            date: "2024-11-27T14:30:19+05:30",
            noOfAppointments: 30,
            doctorUnavailbility: 1
        },
        {
            date: "2024-11-28T14:30:19+05:30",
            noOfAppointments: 8,
            doctorUnavailbility: 2
        },
        {
            date: "2024-11-23T14:30:19+05:30",
            noOfAppointments: 28,
            doctorUnavailbility: 0
        }
      ]


    return (
        <Table>
          <TableCaption>Next 7 days Appointments list.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">No. of Doctors on Leave</TableHead>
              <TableHead className="text-end">No. of Appointments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.date}>
                <TableCell>{moment(invoice.date).format("Do MMMM, dddd")}</TableCell>
                <TableCell className="text-center">{invoice.doctorUnavailbility}</TableCell>
                <TableCell className="text-end">{invoice.noOfAppointments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
}
