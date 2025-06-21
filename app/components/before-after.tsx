export default function BeforeAfter({ config }: { config?: any }) {
  return (
    <section id="features">
      <div className="mx-auto max-w-5xl px-8 py-16 md:py-24">
        {/* <ProblemsTitle /> */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white shadow-lg ring-2 ring-inset ring-slate-200">
            <div className="p-8 sm:p-12">
              <div className="inline-flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M232,184a8,8,0,0,1-16,0A88,88,0,0,0,67.47,120.16l26.19,26.18A8,8,0,0,1,88,160H24a8,8,0,0,1-8-8V88a8,8,0,0,1,13.66-5.66l26.48,26.48A104,104,0,0,1,232,184Z"></path>
                </svg>
                <p className="text-base font-semibold text-slate-700">Before</p>
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Traditional HR methods that limit effectiveness
              </h3>
              <ul className="mt-6 space-y-3 text-base text-slate-600 sm:text-lg">
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      className="h-4 w-4 text-slate-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  Manual paperwork & spreadsheets – Time-consuming, error-prone,
                  and hard to track.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      className="h-4 w-4 text-slate-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  In-person or email-based approvals – Delays in leave requests,
                  reimbursements, and other processes.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      className="h-4 w-4 text-slate-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  Disorganized employee records – Files scattered across emails,
                  folders, and cabinets.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      className="h-4 w-4 text-slate-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  Time-consuming payroll processing – Manual calculations lead
                  to mistakes and compliance risks.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      className="h-4 w-4 text-slate-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  Limited visibility into performance – Annual reviews don’t
                  provide real-time insights.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      className="h-4 w-4 text-slate-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  Compliance risks – Keeping up with labor laws manually is
                  complex and risky.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      className="h-4 w-4 text-slate-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  Poor employee engagement – Lack of tools for recognition,
                  feedback, and growth.
                </li>
              </ul>
            </div>
          </div>
          <div className="rounded-2xl bg-darkYellow shadow-lg ring-1 ring-inset ring-midYellow">
            <div className="p-8 sm:p-12">
              <div className="inline-flex items-center gap-2">
                <p className="text-base font-semibold text-white">After</p>
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L212.69,104,170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66Zm-48-11.32-48-48A8,8,0,0,0,120,56V96.3A104.15,104.15,0,0,0,24,200a8,8,0,0,0,16,0,88.11,88.11,0,0,1,80-87.63V152a8,8,0,0,0,13.66,5.66l48-48A8,8,0,0,0,181.66,98.34Z"></path>
                </svg>
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                HR Software that helps you manage your team smarter, faster &
                more efficiently
              </h3>
              <ul className="mt-6 space-y-3 text-base text-white sm:text-lg">
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>
                    </svg>
                  </div>
                  Automated workflows – Reduce paperwork, minimize errors, and
                  save hours of admin work.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>
                    </svg>
                  </div>
                  Self-service portals – Employees and managers can handle
                  requests instantly with automated approvals.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>
                    </svg>
                  </div>
                  Centralized employee database – All documents, performance
                  reviews, and records in one secure, searchable place.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>
                    </svg>
                  </div>
                  Seamless payroll integration – Automate tax calculations,
                  deductions, and payments with accuracy.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>
                    </svg>
                  </div>
                  Real-time analytics & feedback – Track performance,
                  engagement, and productivity with data-driven insights.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>
                    </svg>
                  </div>
                  Automated compliance updates – Stay aligned with regulations
                  through built-in legal updates.
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 py-1.5">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>
                    </svg>
                  </div>
                  Engagement & growth features – Surveys, goal tracking, and
                  recognition tools keep teams motivated.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
