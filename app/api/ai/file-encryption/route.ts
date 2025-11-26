import { detectFileEncryption } from "@/lib/ai-threat-analyzer"

export async function POST(req: Request) {
  try {
    const { fileData, fileName } = await req.json()

    if (!fileData || !fileName) {
      return Response.json({ error: "File data and name are required" }, { status: 400 })
    }

    const encryptionAnalysis = await detectFileEncryption(fileData, fileName)

    return Response.json({
      success: true,
      encryptionAnalysis,
    })
  } catch (error) {
    console.error("File encryption detection error:", error)
    return Response.json({ error: "Failed to detect file encryption" }, { status: 500 })
  }
}
