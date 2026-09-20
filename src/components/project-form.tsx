import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countries, connectionMethods, priorities } from "@/lib/countries";
import { projectRequestSchema, submitProjectRequest } from "@/lib/project-request.functions";

const OPEN_EVENT = "imagenmerce:open-project-form";

export function openProjectForm() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

const empty = {
  firstName: "",
  lastName: "",
  businessName: "",
  imagesRequired: 6,
  priority: priorities[1],
  email: "",
  country: "United States",
  phone: "",
  preferredConnection: "Email",
};

const fieldClass = "mt-2 h-11 rounded-md border-input bg-card";
const selectClass =
  "mt-2 h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ProjectFormDialog() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(empty);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      setDone(false);
      setError(null);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const set = <K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) =>
    setValues((previous) => ({ ...previous, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const dialCode = countries.find((country) => country.name === values.country)?.code ?? "+1";
    const parsed = projectRequestSchema.safeParse({ ...values, countryCode: dialCode });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await submitProjectRequest({ data: parsed.data });
      setValues(empty);
      setDone(true);
    } catch {
      setError("Something went wrong while sending your request. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const dialCode = countries.find((country) => country.name === values.country)?.code ?? "+1";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-lg bg-background">
        {done ? (
          <div className="py-10 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-signal/12 text-signal">
              <Check size={26} />
            </span>
            <h2 className="display-title mt-7 text-4xl">Thank You</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Thank you for submitting your project request. We have received your information and will get back to you
              shortly.
            </p>
            <Button className="mt-8" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <p className="eyebrow text-signal">Project application</p>
              <DialogTitle className="display-title text-4xl">Start a Project</DialogTitle>
              <DialogDescription>
                Share your product imaging requirements. We reply with next steps and the required references.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} className="mt-2 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" className={fieldClass} maxLength={100} value={values.firstName} onChange={(e) => set("firstName", e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" className={fieldClass} maxLength={100} value={values.lastName} onChange={(e) => set("lastName", e.target.value)} required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="businessName">Business / platform name</Label>
                <Input id="businessName" className={fieldClass} maxLength={160} value={values.businessName} onChange={(e) => set("businessName", e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="images">Images required per product</Label>
                <select id="images" className={selectClass} value={values.imagesRequired} onChange={(e) => set("imagesRequired", Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Image" : "Images"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="priority">Project priority</Label>
                <select id="priority" className={selectClass} value={values.priority} onChange={(e) => set("priority", e.target.value)}>
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className={fieldClass} maxLength={255} value={values.email} onChange={(e) => set("email", e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <select id="country" className={selectClass} value={values.country} onChange={(e) => set("country", e.target.value)}>
                  {countries.map((country) => (
                    <option key={`${country.name}${country.code}`} value={country.name}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <div className="mt-2 flex h-11 items-center rounded-md border border-input bg-card">
                  <span className="px-3 text-sm text-muted-foreground">{dialCode}</span>
                  <input
                    id="phone"
                    inputMode="tel"
                    maxLength={32}
                    value={values.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    required
                    className="h-full w-full rounded-r-md border-l border-input bg-transparent px-3 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="connection">Preferred connection</Label>
                <select id="connection" className={selectClass} value={values.preferredConnection} onChange={(e) => set("preferredConnection", e.target.value)}>
                  {connectionMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="sm:col-span-2 text-sm text-destructive">{error}</p>}

              <div className="sm:col-span-2 flex flex-wrap items-center gap-4 border-t pt-5">
                <Button type="submit" disabled={sending}>
                  {sending && <Loader2 className="animate-spin" size={15} />}
                  {sending ? "Sending" : "Submit project request"}
                </Button>
                <p className="text-xs text-muted-foreground">We only use these details to reply to your request.</p>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
