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

import { MdOutlineEdit } from "react-icons/md";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Settings2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import TopicFilter from "../TopicFilter";
import { DataTablePagination } from "../DataTablePagination";
import { useTranslations } from "next-intl";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { DataTablePagination } from "./DataTablePagination";
// import TopicFilter from "./TopicFilter";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  noteTitle: string[];
  topicFilter: string;
  setTopicFilter: Dispatch<SetStateAction<any>>;
  setShowMatchingNote: Dispatch<SetStateAction<any>>;
  setFilterOutNote: Dispatch<SetStateAction<any[]>>;
}

export function AllDataTable<TData extends any, TValue>({
  columns,
  data,
  noteTitle,
  topicFilter,
  setTopicFilter,
  setShowMatchingNote,
  setFilterOutNote,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });
  const e = useTranslations("Editquestion");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
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
    // ... more color classes
  ];
  return (
    <Card className="relative w-full dark:border-none   dark:shadow-md dark:shadow-violet-300">
      <CardHeader>
        <CardTitle className="font-bold">{e("title")}</CardTitle>
        <CardDescription>{e("description")}</CardDescription>
        <span className="absolute right-10 top-10 hidden scale-[1.6]  rounded-full bg-neutral-100 p-[0.3rem] text-neutral-800 drop-shadow-sm md:block lg:block dark:bg-transparent dark:text-teal-400 dark:shadow-sm dark:shadow-teal-200">
          <MdOutlineEdit />
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center py-4">
          <Input
            placeholder={e("filter.placeholder")}
            value={
              (table.getColumn("questionTitle")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("questionTitle")
                ?.setFilterValue(event.target.value)
            }
            className="h-9 max-w-sm lg:mr-3 dark:border-none   dark:shadow-sm dark:shadow-violet-300 dark:focus-visible:ring-indigo-400"
          />

          <TopicFilter
            colorClasses={colorClasses}
            noteTitle={noteTitle}
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
                className="ml-auto mt-1 space-x-1 md:mt-0 dark:border-none   dark:shadow-sm dark:shadow-violet-300"
              >
                <span className="scale-[0.8] text-sm font-thin">
                  <Settings2 />
                </span>
                <span>{e("view")}</span>
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
                      {column.id == "questionTitle"
                        ? e("table.title")
                        : column.id == "note"
                          ? e("table.note")
                          : column.id == "note_updateAt"
                            ? e("table.update")
                            : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* table */}
        <div className=" overflow-hidden rounded-md border dark:border-none dark:shadow-sm dark:shadow-violet-200">
          <Table>
            <TableHeader className=" dark:border-stone-600 dark:bg-indigo-500">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className=" dark:border-stone-800 "
                >
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="relative dark:border-stone-800 dark:text-foreground"
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
                        {/* resize hander */}
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
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className=" dark:border-stone-800 dark:text-stone-400"
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
                    {e("filter.result")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="py-6">
          <DataTablePagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
}
