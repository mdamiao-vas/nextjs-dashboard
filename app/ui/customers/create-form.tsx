"use client";

import Link from "next/link";
import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createCustomer } from "@/app/lib/customerActions"; // Assuming this is your custom async function
import { AtSymbolIcon, PhotoIcon } from "@heroicons/react/20/solid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function Form() {
  // Track form data with state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image_url: "",
  });

  // Track error messages
  const [state, setState] = useState({
    errors: {} as { [key: string]: string[] },
    message: null as string | null,
  });

  // Track loading state (e.g., when the form is being submitted)
  const [pending, setPending] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setPending(true);
    setState({ errors: {}, message: null });

    try {
      // Create a new FormData instance
      const formData2 = new FormData();

      // Append form fields to FormData
      formData2.append("name", formData.name);
      formData2.append("email", formData.email);
      formData2.append("image_url", formData.image_url);

      // Assuming createCustomer now expects FormData as the second argument
      const prevState = state;

      // Call createCustomer with both prevState and FormData
      const response = await createCustomer(prevState, formData2);

      if (!response.errors) {
        revalidatePath("/dashboard/customers");
        redirect("/dashboard/customers");
      } else {
        setState({ errors: response.errors || {}, message: null });
      }
    } catch (error) {
      setState({
        errors: {},
        message: "An error occurred while creating the customer.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Choose a name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name} // Bind to state
                onChange={handleChange} // Handle input change
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="text"
                placeholder="email@email.com"
                value={formData.email} // Bind to state
                onChange={handleChange} // Handle input change
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Image URL
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="image_url"
                name="image_url"
                type="text"
                placeholder="Image URL"
                value={formData.image_url} // Bind to state
                onChange={handleChange} // Handle input change
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="image_url-error"
              />
              <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="image_url-error" aria-live="polite" aria-atomic="true">
              {state.errors?.image_url &&
                state.errors.image_url.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">
          {pending ? "Creating..." : "Create customer"}
        </Button>
      </div>

      {/* Success or error message */}
      {state.message && (
        <div className="mt-4 text-green-500">{state.message}</div>
      )}
    </form>
  );
}
