import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export const projectRequestSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  businessName: z.string().trim().min(1, "Business or platform name is required").max(160),
  imagesRequired: z.number().int().min(1).max(6),
  priority: z.string().trim().min(1, "Select a priority").max(60),
  email: z.string().trim().email("Enter a valid email address").max(255),
  country: z.string().trim().min(1, "Select a country").max(80),
  countryCode: z.string().trim().min(1).max(8),
  phone: z.string().trim().min(4, "Enter a valid phone number").max(32),
  preferredConnection: z.string().trim().min(1, "Select a preferred connection").max(40),
});

export type ProjectRequestInput = z.infer<typeof projectRequestSchema>;

export const submitProjectRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => projectRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { error } = await supabase.from("project_requests").insert({
      first_name: data.firstName,
      last_name: data.lastName,
      business_name: data.businessName,
      images_required: data.imagesRequired,
      priority: data.priority,
      email: data.email,
      country: data.country,
      country_code: data.countryCode,
      phone: data.phone,
      preferred_connection: data.preferredConnection,
    });

    if (error) {
      console.error("project_request_insert_failed", error.message);
      throw new Error("We could not save your request. Please try again.");
    }

    return { ok: true as const };
  });
