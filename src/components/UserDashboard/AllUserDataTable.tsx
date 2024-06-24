"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { BiSolidBookmarkAltPlus } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Settings2 } from "lucide-react";

import { DataTablePagination } from "../DataTablePagination";
import TopicFilter from "../TopicFilter";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useTranslations } from "next-intl";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  topicFilter: string;
  setTopicFilter: Dispatch<SetStateAction<any>>;
  setShowMatchingNote: Dispatch<SetStateAction<any>>;
  setFilterOutNote: Dispatch<SetStateAction<any[]>>;
}

export function AllUserDataTable<TData extends any, TValue>({
  columns,
  data,
  topicFilter,
  setTopicFilter,
  setShowMatchingNote,
  setFilterOutNote,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const d = useTranslations("Dashboard");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    sortDescFirst: true,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const colorClasses = [
    "bg-red-400",
    "bg-teal-400",
    "bg-indigo-400",
    "bg-sky-400",
    "bg-emerald-400",
    "bg-lime-400",
    "bg-pink-400",
    "bg-violet-400",
    "bg-orange-400",
    "bg-amber-400",
    "bg-green-400",
    "bg-blue-400",
  ];
  return (
    <div className="relative w-full transition-all duration-700 ease-in-out dark:bg-background">
      {/* <CardContent className="border-none px-0"> */}
      <div className="flex flex-wrap items-center py-4">
        <Input
          placeholder={d("data.table.filter")}
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="h-9 max-w-sm lg:mr-3 dark:border-none dark:shadow-sm dark:shadow-violet-200"
        />

        <TopicFilter
          colorClasses={colorClasses}
          noteTitle={["admin", "user"]}
          topicFilter={topicFilter}
          setTopicFilter={setTopicFilter}
          setShowMatchingNote={setShowMatchingNote}
          setFilterOutNote={setFilterOutNote}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={"sm"}
              className="ml-auto mt-1 space-x-1 md:mt-0 dark:border-none dark:shadow-sm dark:shadow-violet-200"
            >
              <span className="scale-[0.8] text-sm font-thin">
                <Settings2 />
              </span>
              <span>{d("data.table.views")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id == "fullName"
                      ? d("data.table.column.full-name")
                      : column.id == "publicMetadata"
                        ? d("data.table.column.role")
                        : column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* table */}
      <div className="flex w-full   overflow-x-auto rounded-md  border  dark:border-stone-600">
        <div className="max-w-full md:max-w-full ">
          <Table className="w-full  dark:border-stone-600">
            <TableHeader className="bg-stone-50 dark:border-stone-600 dark:bg-indigo-500  ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="dark:border-stone-600"
                >
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="relative dark:text-foreground"
                        colSpan={header.colSpan}
                        style={{
                          position: "relative",
                          width: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}

                        {index !== headerGroup.headers.length - 1 && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={`resizer ${
                              header.column.getIsResizing() ? "isResizing" : ""
                            }`}
                          ></div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className=" dark:bg-background">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`${
                      index % 2 == 0
                        ? "bg-white dark:bg-background"
                        : "bg-stone-50 dark:bg-background"
                    } dark:border-stone-600`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {d("data.table.result")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="py-6">
        <DataTablePagination table={table} />
      </div>
      {/* </CardContent> */}
    </div>
  );
}
