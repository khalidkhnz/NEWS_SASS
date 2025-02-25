"use client";

import CustomAlert from "@/components/CustomAlert";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomInteractiveTable from "@/components/CustomInteractiveTable";
import { CustomPagination } from "@/components/CustomPagination";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Trash2 } from "lucide-react";
import React, { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loading";
import useDebounce from "@/hooks/useDebounce";
import { parseAsInteger, useQueryState } from "nuqs";
import { ICategory } from "@/schema/categories";
import { Card } from "@/components/ui/card";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@radix-ui/react-alert-dialog";
import { useFormik } from "formik";
import { createCategory } from "@/actions/category/create-category";
import { deleteCategory } from "@/actions/category/delete-category";
import { updateCategory } from "@/actions/category/update-category";
import { getCategories } from "@/actions/category/get-categories";
import { Toast } from "@/lib/Toast";
import Constants from "@/lib/constants";
import { formatDateString } from "@/lib/utils";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <App />
    </Suspense>
  );
}

const App = () => {
  const [searchTerm, setSearchTerm] = useQueryState("search");
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const debouncedSearchTerm = useDebounce(searchTerm, 500) || "";

  const {
    data: Response,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`categories-${debouncedSearchTerm}-${page}`],
    queryFn: () =>
      getCategories({
        limit: 20,
        search: debouncedSearchTerm,
        page: page,
      }),
  });

  const data = Response?.data || [];

  const Columns: ColumnDef<ICategory>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="rounded-lg"
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
          className="rounded-lg"
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "id",
      header() {
        return null;
      },
      cell() {
        return null;
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <div
            className="cursor-pointer text-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category Name
          </div>
        );
      },
      cell: ({ row }) => {
        return <div className="text-nowrap">{row.getValue("category")}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <div
            className="cursor-pointer text-nowrap text-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-nowrap text-center">
            {formatDateString(row.getValue("createdAt"))}
          </div>
        );
      },
    },

    {
      id: "actions",
      enableHiding: false,
      header() {
        return (
          <div className="flex w-[100px] items-center justify-center text-center">
            Actions
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex gap-3">
            <CustomAlert
              trigger={
                <SquarePen className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-500" />
              }
              component={
                <AddCategoryForm
                  update={true}
                  initialVal={{
                    id: row.getValue("id"),
                    category: row.getValue("category"),
                  }}
                  refetch={() => refetch()}
                />
              }
            />

            <CustomAlert
              onConfirm={async () => {
                const formData = new FormData();
                formData.append("id", row.getValue("id"));
                deleteCategory({}, formData).then(async (res) => {
                  if (!res.errors) {
                    Toast.success(res?.message);
                  } else {
                    Toast.error(res?.message);
                  }
                  refetch();
                });
              }}
              variant="confirmation"
              trigger={
                <Trash2 className="h-5 w-5 cursor-pointer text-red-600 hover:text-red-500" />
              }
            />
          </div>
        );
      },
    },
  ];

  if (isLoading) return <Loader />;

  if (!data || !Array.isArray(data)) return <h2>Something went wrong</h2>;

  return (
    <div className="min-h-screen w-full shadow-md dark:border-muted">
      <div className="bg-neutral-900 px-10 text-white p-2 h-[60px] flex items-center">
        <h1 className="text-3xl">Manage Categories</h1>
      </div>

      <div className="flex w-full items-center justify-end p-4">
        <CustomAlert
          trigger={
            <CustomButton
              gradient
              className="w-[180px] min-w-[180px] max-w-[180px]"
            >
              Add Category
            </CustomButton>
          }
          component={<AddCategoryForm refetch={() => refetch()} />}
        />
      </div>
      {isLoading && (
        <Loader className="flex h-[300px] w-full items-center justify-center" />
      )}
      {!isLoading && (
        <div className="p-2">
          <CustomInteractiveTable
            onTopOfTheTable={() => (
              <div className="flex items-center justify-between rounded-t-lg bg-primary/20 p-2">
                <CustomInput
                  className="hidden max-w-[350px] rounded-xl bg-white md:flex"
                  placeholder="Search By Name"
                  value={searchTerm || ""}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            className=""
            headClassName="text-primary"
            headerClassName="bg-primary/10 text-black hover:bg-primary/10"
            columns={Columns}
            data={data}
            columnNameForSearch="email"
            searchPlaceholder="Filter name..."
            customPagination={() => (
              <div className="py-3">
                <CustomPagination
                  currentPage={page}
                  itemSize={Response?.totalPages || 1}
                  setPage={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

function AddCategoryForm({
  initialVal = { id: "", category: "" },
  refetch,
  update,
}: {
  initialVal?: { id?: string; category?: string };
  refetch: () => void;
  update?: boolean;
}) {
  const fk = useFormik({
    initialValues: {
      id: initialVal?.id || "",
      category: initialVal.category || "",
    },
    async onSubmit(vals) {
      const formData = new FormData();
      formData.append("category", vals.category);
      if (update) {
        formData.append("id", vals.id);
        await updateCategory({}, formData).then(async (res) => {
          Toast.success(res?.message);
          refetch();
        });
        return;
      } else {
        await createCategory({}, formData).then(async (res) => {
          Toast.success(res?.message);
          refetch();
        });
      }
    },
  });

  return (
    <Card className="flex flex-col gap-4 w-[450px] p-6">
      <CustomInput
        name="category"
        value={fk.values.category}
        onChange={(e) => fk.setFieldValue("category", e.target.value)}
        label="Enter Category name"
        className="border-[1px] border-black"
      />
      <div className="flex gap-2 justify-end">
        <AlertDialogAction
          disabled={!fk.values.category}
          onClick={() => fk.handleSubmit()}
          className="w-[100px] disabled:bg-black/50 h-9 bg-primary rounded-md text-white"
        >
          <span className="text-sm">{update ? "Update" : "Create"}</span>
        </AlertDialogAction>
        <AlertDialogCancel className="w-[100px] h-9 bg-red-400 hover:bg-red-500 rounded-md text-white">
          <span className="text-sm">Cancel</span>
        </AlertDialogCancel>
      </div>
    </Card>
  );
}
