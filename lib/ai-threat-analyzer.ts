"use server"

import { generateText, generateObject } from "ai"
import { z } from "zod"

const threatSafetySchema = z.object({
  isSafe: z.boolean().describe("Whether the threat is safe or not"),
  safetyScore: z.number().min(0).max(100).describe("Safety score from 0-100"),
  riskFactors: z.array(z.string()).describe("Key risk factors identified"),
  recommendations: z.array(z.string()).describe("Safety recommendations"),
  confidence: z.number().min(0).max(1).describe("Confidence level of analysis"),
})

const fileEncryptionSchema = z.object({
  isEncrypted: z.boolean().describe("Whether the file is encrypted"),
  encryptionType: z.string().nullable().describe("Type of encryption if present"),
  encryptionStrength: z.enum(["weak", "moderate", "strong", "unknown"]).describe("Strength of encryption"),
  securityRisks: z.array(z.string()).describe("Security risks identified"),
  fileSignature: z.string().describe("File signature/magic bytes"),
  recommendations: z.array(z.string()).describe("Security recommendations"),
})

export async function analyzeThreatSafety(threatData: string) {
  try {
    const { object } = await generateObject({
      model: "openai/gpt-5-mini",
      schema: threatSafetySchema,
      messages: [
        {
          role: "user",
          content: `Analyze this cybersecurity threat and determine if it's genuinely dangerous or safe: ${threatData}. Consider the threat type, severity, indicators, and attack vectors. Provide a detailed safety assessment.`,
        },
      ],
    })

    return object
  } catch (error) {
    console.error("AI threat analysis error:", error)
    throw new Error("Failed to analyze threat safety")
  }
}

export async function detectFileEncryption(fileData: string, fileName: string) {
  try {
    const { object } = await generateObject({
      model: "openai/gpt-5-mini",
      schema: fileEncryptionSchema,
      messages: [
        {
          role: "user",
          content: `Analyze this file for encryption: File name: ${fileName}, Data sample: ${fileData.substring(0, 500)}. Identify if the file is encrypted, what encryption method is used, assess encryption strength, and provide security recommendations.`,
        },
      ],
    })

    return object
  } catch (error) {
    console.error("File encryption detection error:", error)
    throw new Error("Failed to detect file encryption")
  }
}

export async function getDetailedThreatAnalysis(threatDescription: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `Provide a comprehensive security analysis of this threat: ${threatDescription}. Include: 1) Threat overview, 2) Attack vectors, 3) Potential impact, 4) Mitigation strategies, 5) Detection methods`,
      maxOutputTokens: 1000,
    })

    return text
  } catch (error) {
    console.error("Detailed threat analysis error:", error)
    throw new Error("Failed to generate detailed analysis")
  }
}
