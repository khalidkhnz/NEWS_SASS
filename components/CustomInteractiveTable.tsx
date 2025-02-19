"use client";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table as TableType,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import CustomButton from "./CustomButton";
import CustomAlert from "./CustomAlert";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { AlertDialogAction } from "./ui/alert-dialog";
import { ScrollArea } from "./ui/scroll-area";

// EXAMPLE

type IStatus = "success" | "pending" | "processing" | "failed";

// EXAMPLE
type Payment = {
  id: string;
  fullName: string;
  amount: number;
  status: IStatus;
  email: string;
};

const statusBadge = {
  success: (
    <Badge className="ripple flex w-[100px] justify-center bg-green-600 text-center hover:bg-green-600/80">
      success
    </Badge>
  ),
  failed: (
    <Badge className="ripple flex w-[100px] justify-center bg-red-600 text-center hover:bg-red-600/80">
      failed
    </Badge>
  ),
  processing: (
    <Badge className="ripple flex w-[100px] justify-center bg-orange-600 text-center hover:bg-orange-600/80">
      processing
    </Badge>
  ),
  pending: (
    <Badge className="ripple flex w-[100px] justify-center bg-blue-600 text-center hover:bg-blue-600/80">
      pending
    </Badge>
  ),
};

// EXAMPLE
export const DummyColumns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: (head) => {
      return (
        <CustomButton
          variant={"ghost"}
          className="p-0"
          onClick={() =>
            head.column.toggleSorting(head.column.getIsSorted() === "asc")
          }
        >
          Full Name
          <CaretSortIcon className="h-4 w-4" />
        </CustomButton>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("fullName")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: (head) => {
      return (
        <CustomButton
          variant={"ghost"}
          className="p-0"
          onClick={() =>
            head.column.toggleSorting(head.column.getIsSorted() === "asc")
          }
        >
          Status
          <CaretSortIcon className="h-4 w-4" />
        </CustomButton>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {statusBadge[row.getValue("status") as keyof typeof statusBadge]}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <CustomButton
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </CustomButton>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: (head) => {
      return (
        <div className="flex justify-center text-center">
          <CustomButton
            variant={"ghost"}
            className="p-0"
            onClick={() =>
              head.column.toggleSorting(head.column.getIsSorted() === "asc")
            }
          >
            Amount
          </CustomButton>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    id: "delete-action",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <CustomAlert
          onConfirm={() => console.log(row.getValue("fullName"))}
          variant="confirmation"
          trigger={
            <Trash2 className="h-5 w-5 cursor-pointer text-red-600 hover:text-red-500" />
          }
        ></CustomAlert>
      );
    },
  },
];

interface ICustomInteractiveTableProps {
  onTopOfTheTable?: (table: TableType<any>) => any;
  className?: string;
  headClassName?: string;
  headerClassName?: string;
  searchPlaceholder: string;
  columnNameForSearch: string;
  debugSelectionMode?: boolean;
  enableToolbar?: boolean;
  enableSearch?: boolean;
  data: {
    [key: string]: any;
  }[];
  columns: ColumnDef<any>[];
  customPagination?: (...props: any) => any;
}

export default function CustomInteractiveTable({
  columnNameForSearch,
  className,
  onTopOfTheTable,
  columns,
  headerClassName,
  headClassName,
  data,
  searchPlaceholder,
  debugSelectionMode = false,
  enableToolbar = false,
  enableSearch = false,
  customPagination = () => {},
}: ICustomInteractiveTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const rowCount = table.getRowModel().rows?.length || 0;
  // 100 px
  // Max : 600
  const minHeight = Math.min(80 + rowCount * 50, 600);
  return (
    <div className={cn("flex flex-col", className)}>
      {onTopOfTheTable && onTopOfTheTable(table)}

      {debugSelectionMode && (
        <div className="mb-6 overflow-scroll rounded-lg border bg-muted/5">
          <div className="bg-muted/10 px-4 py-2 text-sm font-medium">
            Selected Data
          </div>
          <ScrollArea className="h-[400px]">
            <pre className="p-4 text-sm">
              <code>
                {JSON.stringify(
                  Object.keys(rowSelection).map(
                    (key) => data[key as keyof typeof data]
                  ),
                  null,
                  2
                )}
              </code>
            </pre>
          </ScrollArea>
        </div>
      )}

      {enableToolbar && (
        <div
          className={cn(
            "mb-6 flex items-center gap-4 rounded-lg border bg-background p-4 shadow-sm transition-colors",
            { "bg-muted/5": Object.keys(rowSelection).length > 0 }
          )}
        >
          <CustomAlert
            variant="default_custom"
            component={
              <div className="h-[400px] w-[400px] rounded-xl bg-card p-4 shadow-lg">
                <AlertDialogAction>
                  <CustomButton className="w-full">Continue</CustomButton>
                </AlertDialogAction>
              </div>
            }
            trigger={
              <Button variant="outline" size="sm" className="gap-2">
                <span className="text-sm font-medium">Add New</span>
              </Button>
            }
          />

          <CustomAlert
            disabled={Object.keys(rowSelection)?.length === 0}
            variant="confirmation"
            confirmationButtonText="Delete"
            trigger={
              <Button
                variant="outline"
                size="sm"
                className={cn("gap-2 text-red-600 hover:text-red-700", {
                  "opacity-50": Object.keys(rowSelection)?.length === 0,
                })}
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-sm font-medium">Delete Selected</span>
              </Button>
            }
          />
        </div>
      )}

      {enableSearch && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={
                (table
                  .getColumn(columnNameForSearch)
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(columnNameForSearch)
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm pl-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
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
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="relative rounded-lg border shadow-sm">
        <div className="overflow-hidden">
          <div
            className={`w-full overflow-y-auto`}
            style={{ height: `${minHeight}px` }}
          >
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader
                    className={cn(
                      "sticky top-0 z-10 bg-muted/5",
                      headerClassName
                    )}
                  >
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className={cn(
                              "h-11 whitespace-nowrap px-4 py-3",
                              headClassName
                            )}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className={cn("transition-colors hover:bg-muted/5", {
                            "bg-muted/5": row.getIsSelected(),
                          })}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="whitespace-nowrap px-4 py-3"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
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
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <span>No results found</span>
                            {columnFilters.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setColumnFilters([])}
                              >
                                Clear filters
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {customPagination ? (
        customPagination()
      ) : (
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
