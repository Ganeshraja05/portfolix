"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertCircle,
  BarChart3,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Info,
  Lightbulb,
  RefreshCw,
  Star,
  ThumbsUp,
  X,
  Loader2,
  BarChart,
  PieChart,
  Settings,
  Plus,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface ResultDisplayProps {
  data: any
}

export default function ResultDisplay({ data }: ResultDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    metadata: true,
    content: true,
    statistics: true,
    evaluation: true,
    scoring: true,
    enhancements: true,
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [isReanalyzing, setIsReanalyzing] = useState(false)
  const [customKeyword, setCustomKeyword] = useState("")
  const [customKeywords, setCustomKeywords] = useState<string[]>([])
  const [showComparisonMode, setShowComparisonMode] = useState(false)
  const { toast } = useToast()

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]
  const SENTIMENT_COLORS = {
    positive: "#10b981", // green
    neutral: "#6b7280", // gray
    negative: "#ef4444", // red
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleExportPDF = () => {
    // In a real implementation, this would generate a PDF
    toast({
      title: "PDF Export",
      description: "Your analysis results have been exported to PDF.",
    })
  }

  const handleReanalyze = async () => {
    setIsReanalyzing(true)

    // Simulate reanalysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Reanalysis complete",
      description: "Your portfolio has been successfully reanalyzed with updated insights.",
    })

    setIsReanalyzing(false)
  }

  const handleAddCustomKeyword = () => {
    if (customKeyword && !customKeywords.includes(customKeyword)) {
      setCustomKeywords([...customKeywords, customKeyword])
      setCustomKeyword("")

      toast({
        title: "Keyword added",
        description: `"${customKeyword}" has been added to your custom keywords.`,
      })
    }
  }

  const handleRemoveCustomKeyword = (keyword: string) => {
    setCustomKeywords(customKeywords.filter((k) => k !== keyword))
  }

  const handleReset = () => {
    // Clear localStorage and redirect to home
    localStorage.removeItem("portfolixResult")
    window.location.href = "/"
  }

  const renderSentimentBar = (value: number, label: string, color: string) => (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span>{(value * 100).toFixed(1)}%</span>
      </div>
      <Progress value={value * 100} className="h-2" indicatorClassName={`bg-${color}-500`} />
    </div>
  )

  // Prepare data for sentiment pie chart
  const sentimentData = [
    { name: "Positive", value: data.content.sentiment.positive, color: SENTIMENT_COLORS.positive },
    { name: "Neutral", value: data.content.sentiment.neutral, color: SENTIMENT_COLORS.neutral },
    { name: "Negative", value: data.content.sentiment.negative, color: SENTIMENT_COLORS.negative },
  ]

  // Prepare data for keyword bar chart
  const keywordData = data.content.keywords.map((keyword: any) => ({
    name: keyword.word,
    value: keyword.percentage,
  }))

  // Prepare data for skills radar chart
  const skillsData = data.content.skills.map((skill: any) => ({
    name: skill.name,
    value: skill.level * 100,
  }))

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="space-y-4">
        <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="data-[state=active]:bg-teal-500">
                <BarChart className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-teal-500">
                <FileText className="mr-2 h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="scoring" className="data-[state=active]:bg-teal-500">
                <PieChart className="mr-2 h-4 w-4" />
                Scoring
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="relative mx-auto h-40 w-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-5xl font-bold text-teal-500">{data.scoring.overall}</span>
                    <span className="text-lg font-medium text-slate-500">/100</span>
                  </div>
                </div>
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={`${(2 * Math.PI * 45 * data.scoring.overall) / 100} ${2 * Math.PI * 45 * (1 - data.scoring.overall / 100)}`}
                    strokeLinecap="round"
                    className="text-teal-500"
                  />
                </svg>
              </div>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">Overall Score</p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-teal-200 hover:bg-teal-50 hover:text-teal-700 dark:border-teal-900 dark:hover:bg-teal-900/30 dark:hover:text-teal-400"
                onClick={handleExportPDF}
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-teal-200 hover:bg-teal-50 hover:text-teal-700 dark:border-teal-900 dark:hover:bg-teal-900/30 dark:hover:text-teal-400"
                onClick={handleReanalyze}
                disabled={isReanalyzing}
              >
                {isReanalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reanalyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reanalyze
                  </>
                )}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-teal-200 hover:bg-teal-50 hover:text-teal-700 dark:border-teal-900 dark:hover:bg-teal-900/30 dark:hover:text-teal-400"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Customize Keywords
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Custom Keywords</DialogTitle>
                    <DialogDescription>Add custom keywords to analyze in your portfolio</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={customKeyword}
                        onChange={(e) => setCustomKeyword(e.target.value)}
                        placeholder="Enter a keyword"
                        className="flex-1"
                      />
                      <Button onClick={handleAddCustomKeyword} disabled={!customKeyword}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Current Custom Keywords</Label>
                      {customKeywords.length === 0 ? (
                        <p className="text-sm text-slate-500">No custom keywords added yet</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {customKeywords.map((keyword) => (
                            <div
                              key={keyword}
                              className="flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-800 dark:bg-teal-900/50 dark:text-teal-300"
                            >
                              {keyword}
                              <button
                                onClick={() => handleRemoveCustomKeyword(keyword)}
                                className="ml-1 rounded-full p-0.5 hover:bg-teal-200 dark:hover:bg-teal-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Keywords updated",
                          description: "Your custom keywords have been saved and applied.",
                        })
                      }}
                    >
                      Apply Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="w-full justify-start border-teal-200 hover:bg-teal-50 hover:text-teal-700 dark:border-teal-900 dark:hover:bg-teal-900/30 dark:hover:text-teal-400"
                onClick={() => setShowComparisonMode(!showComparisonMode)}
              >
                {showComparisonMode ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Exit Comparison
                  </>
                ) : (
                  <>
                    <BarChart className="mr-2 h-4 w-4" />
                    Compare Results
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                onClick={handleReset}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Metadata Section */}
                <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
                  <CardHeader className="cursor-pointer p-4" onClick={() => toggleSection("metadata")}>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        <div className="flex items-center">
                          <Info className="mr-2 h-5 w-5 text-teal-500" />
                          Metadata
                        </div>
                      </CardTitle>
                      {expandedSections.metadata ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <CardDescription>Basic information about your uploaded portfolio</CardDescription>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedSections.metadata && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="px-4 pb-4 pt-0">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                              <h4 className="mb-1 text-sm font-medium text-teal-600 dark:text-teal-400">Filename</h4>
                              <p className="text-sm text-slate-700 dark:text-slate-300">{data.metadata.filename}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                              <h4 className="mb-1 text-sm font-medium text-teal-600 dark:text-teal-400">URL</h4>
                              <p className="text-sm text-slate-700 dark:text-slate-300">{data.metadata.url}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                              <h4 className="mb-1 text-sm font-medium text-teal-600 dark:text-teal-400">Upload Date</h4>
                              <p className="text-sm text-slate-700 dark:text-slate-300">
                                {new Date(data.metadata.uploadDate).toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                              <h4 className="mb-1 text-sm font-medium text-teal-600 dark:text-teal-400">File Size</h4>
                              <p className="text-sm text-slate-700 dark:text-slate-300">{data.metadata.fileSize}</p>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Statistics Section */}
                <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
                  <CardHeader className="cursor-pointer p-4" onClick={() => toggleSection("statistics")}>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        <div className="flex items-center">
                          <BarChart3 className="mr-2 h-5 w-5 text-teal-500" />
                          Statistics
                        </div>
                      </CardTitle>
                      {expandedSections.statistics ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <CardDescription>Quantitative metrics about your portfolio</CardDescription>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedSections.statistics && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="px-4 pb-4 pt-0">
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="rounded-lg bg-gradient-to-br from-teal-500/10 to-blue-500/10 p-4 text-center shadow-sm">
                              <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Word Count</h4>
                              <p className="mt-2 text-3xl font-bold text-teal-600 dark:text-teal-400">
                                {data.statistics.wordCount}
                              </p>
                            </div>

                            <div className="rounded-lg bg-gradient-to-br from-teal-500/10 to-blue-500/10 p-4 text-center shadow-sm">
                              <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Readability</h4>
                              <p className="mt-2 text-3xl font-bold text-teal-600 dark:text-teal-400">
                                {data.statistics.readabilityScore.toFixed(1)}
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Flesch Reading Ease</p>
                            </div>

                            <div className="rounded-lg bg-gradient-to-br from-teal-500/10 to-blue-500/10 p-4 text-center shadow-sm">
                              <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg. Sentence</h4>
                              <p className="mt-2 text-3xl font-bold text-teal-600 dark:text-teal-400">
                                {data.statistics.averageSentenceLength.toFixed(1)}
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">words per sentence</p>
                            </div>

                            <div className="rounded-lg bg-gradient-to-br from-teal-500/10 to-blue-500/10 p-4 text-center shadow-sm">
                              <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Paragraphs</h4>
                              <p className="mt-2 text-3xl font-bold text-teal-600 dark:text-teal-400">
                                {data.statistics.paragraphCount}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Evaluation Section */}
                <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
                  <CardHeader className="cursor-pointer p-4" onClick={() => toggleSection("evaluation")}>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        <div className="flex items-center">
                          <ThumbsUp className="mr-2 h-5 w-5 text-teal-500" />
                          Evaluation
                        </div>
                      </CardTitle>
                      {expandedSections.evaluation ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <CardDescription>Strengths and weaknesses of your portfolio</CardDescription>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedSections.evaluation && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="px-4 pb-4 pt-0">
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                              <h4 className="mb-3 flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                                <Check className="mr-2 h-4 w-4" />
                                Strengths
                              </h4>
                              <ul className="space-y-2">
                                {data.evaluation.strengths.map((strength: string, index: number) => (
                                  <motion.li
                                    key={index}
                                    className="flex items-start"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <Check className="mr-2 mt-0.5 h-4 w-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{strength}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>

                            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                              <h4 className="mb-3 flex items-center text-sm font-medium text-red-600 dark:text-red-400">
                                <X className="mr-2 h-4 w-4" />
                                Areas for Improvement
                              </h4>
                              <ul className="space-y-2">
                                {data.evaluation.weaknesses.map((weakness: string, index: number) => (
                                  <motion.li
                                    key={index}
                                    className="flex items-start"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <AlertCircle className="mr-2 mt-0.5 h-4 w-4 text-red-600 dark:text-red-400" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{weakness}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Enhancements Section */}
                <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
                  <CardHeader className="cursor-pointer p-4" onClick={() => toggleSection("enhancements")}>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        <div className="flex items-center">
                          <Lightbulb className="mr-2 h-5 w-5 text-teal-500" />
                          Suggested Enhancements
                        </div>
                      </CardTitle>
                      {expandedSections.enhancements ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <CardDescription>Actionable suggestions to improve your portfolio</CardDescription>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedSections.enhancements && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="px-4 pb-4 pt-0">
                          <ul className="space-y-3">
                            {data.enhancements.map((enhancement: string, index: number) => (
                              <motion.li
                                key={index}
                                className="flex items-start rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-900/20"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Lightbulb className="mr-3 mt-0.5 h-5 w-5 text-amber-500" />
                                <span className="text-slate-700 dark:text-slate-300">{enhancement}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </div>
            )}

            {activeTab === "content" && (
              <div className="space-y-6">
                {/* Content Analysis Section */}
                <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
                  <CardHeader className="p-4">
                    <CardTitle>
                      <div className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5 text-teal-500" />
                        Sentiment Analysis
                      </div>
                    </CardTitle>
                    <CardDescription>Emotional tone analysis of your portfolio content</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <div className="mb-4 space-y-3">
                          {renderSentimentBar(data.content.sentiment.positive, "Positive", "green")}
                          {renderSentimentBar(data.content.sentiment.neutral, "Neutral", "gray")}
                          {renderSentimentBar(data.content.sentiment.negative, "Negative", "red")}
                        </div>

                        <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-800">
                          <p className="text-sm">
                            <span className="font-medium">Compound Score:</span>{" "}
                            {data.content.sentiment.compound.toFixed(2)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            A score between -1 (very negative) and 1 (very positive)
                          </p>
                          <p className="mt-2 text-sm">
                            <span className="font-medium">Interpretation:</span>{" "}
                            {data.content.sentiment.compound > 0.05
                              ? "Your portfolio has a positive tone, which is great for making a good impression."
                              : data.content.sentiment.compound < -0.05
                                ? "Your portfolio has a negative tone. Consider revising to create a more positive impression."
                                : "Your portfolio has a neutral tone. Consider adding more positive language to stand out."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="h-64 w-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                              <Pie
                                data={sentimentData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {sentimentData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />
                            </RePieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
                  <CardHeader className="p-4">
                    <CardTitle>
                      <div className="flex items-center">
                        <BarChart className="mr-2 h-5 w-5 text-teal-500" />
                        Keyword Analysis
                      </div>
                    </CardTitle>
                    <CardDescription>Frequency of important keywords in your portfolio</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart
                          data={keywordData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
                          <Tooltip formatter={(value) => [`${value}%`, "Frequency"]} />
                          <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 rounded-md bg-slate-50 p-4 dark:bg-slate-800">
                      <h4 className="mb-2 text-sm font-medium">Keyword Insights</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Your portfolio has a strong emphasis on{" "}
                        <span className="font-medium text-teal-600 dark:text-teal-400">React</span> and{" "}
                        <span className="font-medium text-teal-600 dark:text-teal-400">JavaScript</span>. Consider
                        adding more content about{" "}
                        <span className="font-medium text-amber-600 dark:text-amber-400">design</span> to create a more
                        balanced presentation.
                      </p>
                      {customKeywords.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Custom Keywords</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {customKeywords.map((keyword) => (
                              <div
                                key={keyword}
                                className="rounded-full bg-teal-100 px-3 py-1 text-xs text-teal-800 dark:bg-teal-900/50 dark:text-teal-300"
                              >
                                {keyword}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
                  <CardHeader className="p-4">
                    <CardTitle>
                      <div className="flex items-center">
                        <Star className="mr-2 h-5 w-5 text-teal-500" />
                        Skills Analysis
                      </div>
                    </CardTitle>
                    <CardDescription>Key skills identified in your portfolio</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        {data.content.skills.map((skill: any, index: number) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-sm text-slate-500">{(skill.level * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level * 100}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                              />
                            </div>
                            <p className="text-xs text-slate-500">
                              {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                        <h4 className="mb-3 text-sm font-medium">Skills Insights</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Check className="mr-2 mt-0.5 h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm">
                              Your technical skills are well-represented, particularly in frontend development.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <Check className="mr-2 mt-0.5 h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm">
                              Strong emphasis on modern JavaScript frameworks shows relevant expertise.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <AlertCircle className="mr-2 mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-sm">
                              Consider highlighting more soft skills to balance your technical abilities.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "scoring" && (
              <div className="space-y-6">
                {/* Scoring Section */}
                <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
                  <CardHeader className="p-4">
                    <CardTitle>
                      <div className="flex items-center">
                        <Star className="mr-2 h-5 w-5 text-teal-500" />
                        Detailed Scoring
                      </div>
                    </CardTitle>
                    <CardDescription>Breakdown of your portfolio's performance across key metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="space-y-6">
                        {Object.entries(data.scoring)
                          .filter(([key]) => key !== "overall")
                          .map(([key, value]: [string, any], index: number) => (
                            <div key={key} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium capitalize">{key}</span>
                                <span className="text-sm font-medium">{value}/100</span>
                              </div>
                              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                <motion.div
                                  className={`h-full rounded-full ${
                                    value >= 80 ? "bg-green-500" : value >= 60 ? "bg-amber-500" : "bg-red-500"
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${value}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                />
                              </div>
                              <p className="text-xs text-slate-500">
                                {value >= 80
                                  ? "Excellent"
                                  : value >= 60
                                    ? "Good, but could improve"
                                    : "Needs significant improvement"}
                              </p>
                            </div>
                          ))}
                      </div>

                      <div className="flex flex-col justify-between rounded-lg bg-slate-50 p-6 dark:bg-slate-800">
                        <div>
                          <h4 className="mb-3 text-lg font-medium text-teal-600 dark:text-teal-400">
                            Score Interpretation
                          </h4>
                          <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">
                            Your portfolio scores highest in{" "}
                            <span className="font-medium text-teal-600 dark:text-teal-400">Technical</span> aspects,
                            showing strong professional capabilities. The{" "}
                            <span className="font-medium text-amber-600 dark:text-amber-400">Design</span> score could
                            use improvement to better showcase your work visually.
                          </p>
                        </div>

                        <div className="rounded-md bg-teal-50 p-4 dark:bg-teal-900/30">
                          <h5 className="mb-2 text-sm font-medium text-teal-700 dark:text-teal-300">Recommendation</h5>
                          <p className="text-sm text-teal-700 dark:text-teal-300">
                            Focus on improving your portfolio's <span className="font-medium">Impact</span> score by
                            adding more quantifiable achievements and specific outcomes from your projects.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {showComparisonMode && (
                  <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
                    <CardHeader className="p-4">
                      <CardTitle>
                        <div className="flex items-center">
                          <BarChart className="mr-2 h-5 w-5 text-teal-500" />
                          Resume vs. Portfolio Comparison
                        </div>
                      </CardTitle>
                      <CardDescription>
                        Compare the performance of your resume against your portfolio website
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReBarChart
                            data={[
                              { name: "Clarity", resume: 85, portfolio: 78 },
                              { name: "Relevance", resume: 78, portfolio: 82 },
                              { name: "Impact", resume: 83, portfolio: 75 },
                              { name: "Design", resume: 79, portfolio: 88 },
                              { name: "Technical", resume: 88, portfolio: 84 },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="resume" name="Resume" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="portfolio" name="Portfolio Website" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                          </ReBarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="mt-4 rounded-md bg-slate-50 p-4 dark:bg-slate-800">
                        <h4 className="mb-2 text-sm font-medium">Comparison Insights</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          Your resume scores higher in{" "}
                          <span className="font-medium text-teal-600 dark:text-teal-400">Clarity</span> and{" "}
                          <span className="font-medium text-teal-600 dark:text-teal-400">Impact</span>, while your
                          portfolio website excels in{" "}
                          <span className="font-medium text-blue-600 dark:text-blue-400">Design</span> and{" "}
                          <span className="font-medium text-blue-600 dark:text-blue-400">Relevance</span>. Consider
                          aligning these elements more closely for a consistent professional presentation.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

