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

export default function DashboardDataTable({ data }) {
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
            {data.map((invoice) => (
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
