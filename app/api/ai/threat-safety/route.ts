import { analyzeThreatSafety } from "@/lib/ai-threat-analyzer"

export async function POST(req: Request) {
  try {
    const { threatData } = await req.json()

    if (!threatData) {
      return Response.json({ error: "Threat data is required" }, { status: 400 })
    }

    const analysis = await analyzeThreatSafety(threatData)

    return Response.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("Threat safety analysis error:", error)
    return Response.json({ error: "Failed to analyze threat safety" }, { status: 500 })
  }
}
