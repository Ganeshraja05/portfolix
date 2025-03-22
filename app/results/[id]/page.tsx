"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ResultDisplay from "@/components/result-display"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import ThemeToggle from "@/components/theme-toggle"

interface PageProps {
  params: {
    id: string
  }
}

export default function ResultsPage({ params }: PageProps) {
  const [resultData, setResultData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // In a real implementation, we would fetch the data from the API
    // For now, we'll retrieve it from localStorage
    const storedData = localStorage.getItem("portfolixResult")

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        // Check if the ID matches
        if (parsedData.id === params.id) {
          setResultData(parsedData)
        } else {
          toast({
            title: "Result not found",
            description: "The requested analysis result could not be found.",
            variant: "destructive",
          })
          router.push("/")
        }
      } catch (error) {
        console.error("Error parsing stored data:", error)
        toast({
          title: "Error loading results",
          description: "There was an error loading your analysis results.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "No results found",
        description: "No analysis results were found. Please upload a portfolio to analyze.",
        variant: "destructive",
      })
      router.push("/")
    }

    setLoading(false)
  }, [params.id, router, toast])

  const handleBackClick = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-60 w-full rounded-lg" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="group flex items-center gap-2 rounded-full px-4 py-2 transition-all hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Upload
            </Button>
            <ThemeToggle />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                Analysis Results
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Detailed insights for your {resultData?.type === "resume" ? "resume" : "portfolio website"}
              </p>
            </div>

            {resultData && <ResultDisplay data={resultData} />}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

