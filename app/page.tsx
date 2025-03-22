import UploadForm from "@/components/upload-form"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 p-0.5 shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-white dark:bg-slate-900">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-teal-500"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="animate-fade-in mb-3 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">
            Portfolix
          </h1>
          <p className="animate-fade-in-delay text-lg text-slate-600 dark:text-slate-300">
            Polish Your Portfolio with Style and Insight
          </p>
        </header>

        <div className="mx-auto max-w-3xl">
          <UploadForm />
        </div>

        <Toaster />
      </div>
    </main>
  )
}

