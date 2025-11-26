"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lock, FileText, Loader2, AlertCircle } from "lucide-react"

interface EncryptionAnalysis {
  isEncrypted: boolean
  encryptionType: string | null
  encryptionStrength: "weak" | "moderate" | "strong" | "unknown"
  securityRisks: string[]
  fileSignature: string
  recommendations: string[]
}

export function FileEncryptionChecker() {
  const [fileName, setFileName] = useState("")
  const [fileData, setFileData] = useState("")
  const [analysis, setAnalysis] = useState<EncryptionAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        setFileData(event.target?.result as string)
      }
      reader.readAsText(file).catch(() => {
        // If file is binary, read as base64
        const binaryReader = new FileReader()
        binaryReader.onload = (binaryEvent) => {
          setFileData(binaryEvent.target?.result as string)
        }
        binaryReader.readAsDataURL(file)
      })
    }
  }

  const checkEncryption = async () => {
    if (!fileData || !fileName) {
      setError("Please select a file")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/file-encryption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileData: fileData.substring(0, 1000), fileName }),
      })

      if (!response.ok) {
        throw new Error("Failed to check encryption")
      }

      const data = await response.json()
      setAnalysis(data.encryptionAnalysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check failed")
    } finally {
      setLoading(false)
    }
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "text-green-400"
      case "moderate":
        return "text-yellow-400"
      case "weak":
        return "text-orange-400"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-cyan-400" />
          File Encryption Detector
        </h3>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors cursor-pointer">
            <input type="file" onChange={handleFileUpload} className="hidden" id="file-input" />
            <label htmlFor="file-input" className="cursor-pointer block text-center">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-white font-semibold">Click to upload or drag file</p>
              <p className="text-slate-400 text-sm">Any file type is supported</p>
              {fileName && <p className="text-cyan-400 text-sm mt-2">{fileName}</p>}
            </label>
          </div>

          <Button
            onClick={checkEncryption}
            disabled={loading || !fileData}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Check Encryption
          </Button>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}
        </div>
      </Card>

      {analysis && (
        <Card className="bg-slate-800/50 border-slate-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">Encryption Analysis</h4>
            {analysis.isEncrypted ? (
              <Lock className="w-6 h-6 text-cyan-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Encryption Status</p>
              <p className={`font-semibold ${analysis.isEncrypted ? "text-green-400" : "text-yellow-400"}`}>
                {analysis.isEncrypted ? "Encrypted" : "Not Encrypted"}
              </p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Encryption Type</p>
              <p className="font-semibold text-white">{analysis.encryptionType || "None Detected"}</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Strength Level</p>
              <p className={`font-semibold capitalize ${getStrengthColor(analysis.encryptionStrength)}`}>
                {analysis.encryptionStrength}
              </p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">File Signature</p>
              <p className="font-mono text-sm text-slate-300">{analysis.fileSignature}</p>
            </div>
          </div>

          {analysis.securityRisks.length > 0 && (
            <div>
              <p className="text-white font-semibold mb-2">Security Risks:</p>
              <ul className="space-y-1">
                {analysis.securityRisks.map((risk, i) => (
                  <li key={i} className="text-slate-300 text-sm flex gap-2">
                    <span className="text-red-400">⚠</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.recommendations.length > 0 && (
            <div>
              <p className="text-white font-semibold mb-2">Recommendations:</p>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-slate-300 text-sm flex gap-2">
                    <span className="text-green-400">✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
