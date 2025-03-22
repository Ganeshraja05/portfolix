import { type NextRequest, NextResponse } from "next/server"

// This is a mock implementation of the portfolio retrieval API
// In a real implementation, this would fetch data from a database

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const portfolioId = params.id

    // In a real implementation, we would fetch the portfolio from a database
    // For now, we'll return mock data if the ID matches a certain pattern

    if (portfolioId.startsWith("portfolio_") || portfolioId.startsWith("mock-")) {
      // Simulate database lookup delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockData = {
        id: portfolioId,
        metadata: {
          filename: "resume.pdf",
          url: "https://example.com/portfolio",
          uploadDate: new Date().toISOString(),
          fileSize: "245 KB",
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
          ],
        },
        statistics: {
          wordCount: 475,
          readabilityScore: 68.5,
          averageSentenceLength: 15.2,
        },
        evaluation: {
          strengths: [
            "Clear presentation of technical skills",
            "Good balance of technical and soft skills",
            "Quantifiable achievements included",
          ],
          weaknesses: [
            "Some industry jargon may be unclear to non-technical recruiters",
            "Could benefit from more specific project outcomes",
            "Consider adding more action verbs",
          ],
        },
        scoring: {
          overall: 82,
          clarity: 85,
          relevance: 78,
          impact: 83,
        },
        enhancements: [
          "Add more quantifiable achievements",
          "Consider reorganizing skills section for better readability",
          "Include links to project repositories or live demos",
          "Add a brief personal statement that aligns with target roles",
        ],
      }

      return NextResponse.json(mockData, { status: 200 })
    } else {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error retrieving portfolio:", error)
    return NextResponse.json({ error: "Failed to retrieve portfolio" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const portfolioId = params.id

    // In a real implementation, this would re-analyze the portfolio
    // For now, we'll return mock data with slightly different values

    if (portfolioId.startsWith("portfolio_") || portfolioId.startsWith("mock-")) {
      // Simulate reanalysis delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockData = {
        id: portfolioId,
        metadata: {
          filename: "resume.pdf",
          url: "https://example.com/portfolio",
          uploadDate: new Date().toISOString(),
          fileSize: "245 KB",
        },
        content: {
          sentiment: {
            negative: 0.04,
            neutral: 0.63,
            positive: 0.33,
            compound: 0.29,
          },
          keywords: [
            { word: "react", count: 12, percentage: 2.5 },
            { word: "javascript", count: 8, percentage: 1.7 },
            { word: "typescript", count: 6, percentage: 1.3 },
            { word: "nextjs", count: 5, percentage: 1.0 },
          ],
        },
        statistics: {
          wordCount: 475,
          readabilityScore: 70.2,
          averageSentenceLength: 14.8,
        },
        evaluation: {
          strengths: [
            "Clear presentation of technical skills",
            "Good balance of technical and soft skills",
            "Quantifiable achievements included",
            "Effective use of action verbs",
          ],
          weaknesses: [
            "Some industry jargon may be unclear to non-technical recruiters",
            "Could benefit from more specific project outcomes",
          ],
        },
        scoring: {
          overall: 85,
          clarity: 87,
          relevance: 82,
          impact: 86,
        },
        enhancements: [
          "Add more quantifiable achievements",
          "Consider reorganizing skills section for better readability",
          "Include links to project repositories or live demos",
          "Add a brief personal statement that aligns with target roles",
        ],
      }

      return NextResponse.json(mockData, { status: 200 })
    } else {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error reanalyzing portfolio:", error)
    return NextResponse.json({ error: "Failed to reanalyze portfolio" }, { status: 500 })
  }
}

