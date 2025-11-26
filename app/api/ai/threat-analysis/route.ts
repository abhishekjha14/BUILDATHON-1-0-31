import { getDetailedThreatAnalysis } from "@/lib/ai-threat-analyzer"

export async function POST(req: Request) {
  try {
    const { threatDescription } = await req.json()

    if (!threatDescription) {
      return Response.json({ error: "Threat description is required" }, { status: 400 })
    }

    const detailedAnalysis = await getDetailedThreatAnalysis(threatDescription)

    return Response.json({
      success: true,
      detailedAnalysis,
    })
  } catch (error) {
    console.error("Detailed threat analysis error:", error)
    return Response.json({ error: "Failed to generate threat analysis" }, { status: 500 })
  }
}
