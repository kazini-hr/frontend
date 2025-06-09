import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { externalLinks } from "../app/lib/utils/external-links";

export default function CTA({ config }: { config?: any }) {
  return (
    <section className="bg-base-100 relative">
      <div className="relative mx-auto max-w-7xl px-8 py-24 text-center text-slate-800 md:py-48 flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
        {/* Image Content */}
        <div className="hidden lg:flex lg:w-1/2 justify-center">
          <Image
            src="/2.png"
            alt="hero illustration"
            height={2268}
            width={2268}
            className="max-w-full h-auto"
          />
        </div>
        {/* Text Content */}
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tight md:mb-12 md:text-5xl">
            Maximize Your Productivity With Our HR and Payroll Solution
          </h2>
          <p className="mb-12 max-w-md text-lg text-slate-500">
            Automate all your processes in minutes and focus on what matters
            most - your business.
          </p>
          <Button
            className="h-12 w-48 text-lg"
            color="yellow_dark"
            href={externalLinks.calendlyCEO}
            rel="noopener noreferrer"
            target="_blank"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
