"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { FileUp, Loader2, FileText, Globe, X } from "lucide-react"
import { motion } from "framer-motion"

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("resume")
  const [isDragging, setIsDragging] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check if file is PDF, DOCX, or TXT
      const fileType = selectedFile.type
      if (
        fileType !== "application/pdf" &&
        fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        fileType !== "text/plain"
      ) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)

      // Generate preview for text files
      if (fileType === "text/plain") {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setFilePreview(content.substring(0, 200) + (content.length > 200 ? "..." : ""))
        }
        reader.readAsText(selectedFile)
      } else {
        setFilePreview(`${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]

      // Check file type
      const fileType = droppedFile.type
      if (
        fileType !== "application/pdf" &&
        fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        fileType !== "text/plain"
      ) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file",
          variant: "destructive",
        })
        return
      }

      setFile(droppedFile)

      // Generate preview for text files
      if (fileType === "text/plain") {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setFilePreview(content.substring(0, 200) + (content.length > 200 ? "..." : ""))
        }
        reader.readAsText(droppedFile)
      } else {
        setFilePreview(`${droppedFile.name} (${(droppedFile.size / 1024).toFixed(1)} KB)`)
      }
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that at least one input is provided
    if (!file && !url) {
      toast({
        title: "Missing input",
        description: "Please provide either a resume file or a portfolio URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      if (file) {
        formData.append("file", file)
      }
      if (url) {
        formData.append("url", url)
      }

      // In a real implementation, this would call your backend API
      // For now, we'll simulate a successful response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate a successful analysis with a mock portfolio ID
      const portfolioId = "mock-" + Math.random().toString(36).substring(2, 10)

      // Store mock data in localStorage to simulate persistence
      const mockData = {
        id: portfolioId,
        type: activeTab,
        metadata: {
          filename: file?.name || "N/A",
          url: url || "N/A",
          uploadDate: new Date().toISOString(),
          fileSize: file ? `${Math.round(file.size / 1024)} KB` : "N/A",
        },
        content: {
          sentiment: {
            negative: 0.05,
            neutral: 0.65,
            positive: 0.3,
            compound: 0.25,
          },
          keywords: [
            { word: "react", count: 12, percentage: 2.5 },
            { word: "javascript", count: 8, percentage: 1.7 },
            { word: "typescript", count: 6, percentage: 1.3 },
            { word: "nextjs", count: 5, percentage: 1.0 },
            { word: "design", count: 4, percentage: 0.8 },
          ],
          skills: [
            { name: "React", category: "frontend", level: 0.85 },
            { name: "JavaScript", category: "language", level: 0.9 },
            { name: "TypeScript", category: "language", level: 0.75 },
            { name: "Next.js", category: "framework", level: 0.8 },
            { name: "CSS", category: "frontend", level: 0.7 },
          ],
        },
        statistics: {
          wordCount: 475,
          readabilityScore: 68.5,
          averageSentenceLength: 15.2,
          paragraphCount: 12,
        },
        evaluation: {
          strengths: [
            "Clear presentation of technical skills",
            "Good balance of technical and soft skills",
            "Quantifiable achievements included",
            "Effective use of industry keywords",
          ],
          weaknesses: [
            "Some industry jargon may be unclear to non-technical recruiters",
            "Could benefit from more specific project outcomes",
            "Consider adding more action verbs",
            "Portfolio navigation could be more intuitive",
          ],
        },
        scoring: {
          overall: 82,
          clarity: 85,
          relevance: 78,
          impact: 83,
          design: 79,
          technical: 88,
        },
        enhancements: [
          "Add more quantifiable achievements with specific metrics",
          "Consider reorganizing skills section for better readability",
          "Include links to project repositories or live demos",
          "Add a brief personal statement that aligns with target roles",
          "Improve visual hierarchy with better typography contrast",
        ],
      }

      localStorage.setItem("portfolixResult", JSON.stringify(mockData))

      toast({
        title: "Analysis complete!",
        description: "Your portfolio has been successfully analyzed.",
      })

      // Navigate to results page
      router.push(`/results/${portfolioId}`)
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "There was an error analyzing your portfolio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-none bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-900/80">
        <CardHeader className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 pb-6">
          <CardTitle className="text-2xl font-bold">Upload Your Portfolio</CardTitle>
          <CardDescription>
            Upload a resume file or provide a URL to your portfolio website for instant analysis
          </CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="resume" className="data-[state=active]:bg-teal-500">
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </TabsTrigger>
              <TabsTrigger value="website" className="data-[state=active]:bg-teal-500">
                <Globe className="mr-2 h-4 w-4" />
                Website
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <TabsContent value="resume" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume File (PDF, DOCX, or TXT)</Label>
                    <div
                      className={`relative flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
                        isDragging
                          ? "border-teal-500 bg-teal-500/10"
                          : "border-slate-300 hover:border-teal-500/50 hover:bg-slate-100 dark:border-slate-700 dark:hover:border-teal-500/50 dark:hover:bg-slate-800/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        id="resume"
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="hidden"
                        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      />

                      {!file ? (
                        <>
                          <FileUp className="mb-2 h-10 w-10 text-slate-400" />
                          <p className="mb-1 text-sm font-medium">Drag & drop your file here or click to browse</p>
                          <p className="text-xs text-slate-500">Supports PDF, DOCX, and TXT files</p>
                        </>
                      ) : (
                        <div className="flex w-full flex-col items-center">
                          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-slate-500">{Math.round(file.size / 1024)} KB</p>
                          </div>
                          {filePreview && file.type === "text/plain" && (
                            <div className="mt-4 max-h-24 w-full overflow-hidden rounded-md bg-slate-100 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {filePreview}
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveFile()
                            }}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="website" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="portfolio-url">Portfolio Website URL</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Globe className="h-4 w-4 text-slate-400" />
                        </div>
                        <Input
                          id="portfolio-url"
                          type="url"
                          placeholder="https://your-portfolio.com"
                          value={url}
                          onChange={handleUrlChange}
                          disabled={isLoading}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    {url && (
                      <div className="mt-2 rounded-md bg-slate-100 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <p className="font-medium">Preview URL:</p>
                        <p className="mt-1 truncate">{url}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isLoading || (!file && !url)}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all hover:from-teal-600 hover:to-blue-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileUp className="mr-2 h-4 w-4" />
                      Analyze Portfolio
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Tabs>
      </Card>
    </motion.div>
  )
}

