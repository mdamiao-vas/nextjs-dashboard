import Table from "@/app/ui/customers/table";

import { fetchFilteredCustomers } from "@/app/lib/data";

import { Metadata } from "next";
import { FormattedCustomersTable } from "@/app/lib/definitions";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const customersList: FormattedCustomersTable[] = await fetchFilteredCustomers(
    query
  );

  return (
    <div className="w-full">
      <Table customers={customersList} />
    </div>
  );
}
