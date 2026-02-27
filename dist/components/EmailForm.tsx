"use client";
import React, { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, Mail, User } from "lucide-react";
import { useState } from "react";

const EmailForm = ({ date, title }: { date: string; title: string }) => {
  const [isPending, startTransaction] = useTransition();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate an async operation
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Reset after 1 second
  };

  function getDaysLeft(): number {
    const endDate = new Date(date); // Set your target date here
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const form = new FormData(target);
    const email = form.get("email");
    const fullName = form.get("name") as string;

    if (!email || !fullName) {
      return null;
    }

    // Split full name into first and last name
    const [firstName, ...lastNameParts] = fullName.trim().split(" ");
    const lastName = lastNameParts.join(" ") || ""; // Join remaining parts or empty string

    startTransaction(async () => {
      try {
        const res = await fetch("/api/resend", {
          method: "POST",
          body: JSON.stringify({ email, firstName, lastName }),
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          target.reset();
          toast.success("Thank you for subscribing 🎉");
        } else {
          console.error("Error:", res.status, res.statusText);
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    });
  };
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs font-medium text-black/60">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1F6FEB]" />
          Beta opens in {getDaysLeft()} days
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-black/90">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-black/60">
          Leave your name and email. We’ll send you the download link and setup
          guide when the beta is ready.
        </p>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
        <div>
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <Input
              type="text"
              name="name"
              id="name"
              required
              placeholder="Full name..."
              className="bg-white/70"
            />
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <User size={16} strokeWidth={2} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Email Address..."
              className="bg-white/70"
            />
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <Mail size={16} strokeWidth={2} aria-hidden="true" />
            </div>
          </div>
        </div>

        <Button
          onClick={handleClick}
          disabled={isPending}
          data-loading={isPending}
          type="submit"
          className="group relative w-full rounded-xl bg-[#1F6FEB] text-white shadow-sm hover:bg-[#1A5FD0] disabled:opacity-100"
        >
          <span className="group-data-[loading=true]:text-transparent">
            Join the waitlist
          </span>
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoaderCircle
                className="animate-spin"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
          )}
        </Button>
        <div className="text-xs leading-relaxed text-black/45">
            <div className="font-medium text-black/70">What you’ll get</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Beta download link + setup guide</li>
              <li>Early access to capture presets</li>
              <li>Priority for seed-user feedback slots</li>
            </ul>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;
