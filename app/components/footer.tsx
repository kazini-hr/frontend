import Image from 'next/image';
import Link from 'next/link';
import { externalLinks } from '../lib/utils/external-links';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="px-8 py-24 mx-auto max-w-7xl">
        <div className="flex flex-col flex-wrap md:flex-row md:flex-nowrap lg:items-start">
          <div className="flex-shrink-0 mx-auto w-64 text-center md:mx-0 md:text-left">
            <Link
              href="/"
              aria-current="page"
              className="flex gap-2 justify-center items-center md:justify-start"
            >
              <Image
                src="/images/kazini-hr-original-colors-removebg-preview.png"
                alt="logo"
                width={100}
                height={100}
              />
            </Link>
            <p className="mt-3 text-sm text-slate-700">
              All-in-one HR, Payroll and Benefits software where you can
              automate all your business needs in a matter of minutes
            </p>
            <p className="mt-3 text-sm text-slate-700">
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>
          </div>
          <div className="flex flex-wrap flex-grow justify-center mt-10 -mb-10 text-center md:mt-0 md:pl-24">
            <div className="px-4 w-full md:w-1/2 lg:w-1/3">
              <div className="mb-3 text-sm font-semibold tracking-widest footer-title text-slate-900 md:text-left">
                LINKS
              </div>
              <div className="flex flex-col gap-2 justify-center items-center mb-10 text-sm text-slate-700 hover:text-slate-900 md:items-start">
                <a
                  href="mailto:oliver@kazinihr.co.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover"
                  aria-label="Contact Support"
                >
                  Support & Enquiries
                </a>
                <Link href="/#pricing" className="link link-hover">
                  Pricing
                </Link>
              </div>
            </div>
            <div className="px-4 w-full md:w-1/2 lg:w-1/3">
              <div className="mb-3 text-sm font-semibold tracking-widest footer-title text-slate-900 md:text-left">
                LEGAL
              </div>
              <div className="flex flex-col gap-2 justify-center items-center mb-10 text-sm text-slate-700 hover:text-slate-900 md:items-start">
                <Link
                  href={externalLinks.termsOfService}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="link link-hover"
                >
                  Terms of services
                </Link>
                <Link
                  href={externalLinks.privacyPolicy}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="link link-hover"
                >
                  Privacy policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
