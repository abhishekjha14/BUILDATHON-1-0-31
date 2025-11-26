"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Loader2, Shield } from "lucide-react"

interface ThreatSafetyAnalysis {
  isSafe: boolean
  safetyScore: number
  riskFactors: string[]
  recommendations: string[]
  confidence: number
}

export function AiThreatAnalyzer() {
  const [threatInput, setThreatInput] = useState("")
  const [analysis, setAnalysis] = useState<ThreatSafetyAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeThreat = async () => {
    if (!threatInput.trim()) {
      setError("Please enter threat data")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/threat-safety", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threatData: threatInput }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze threat")
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          AI-Powered Threat Safety Analyzer
        </h3>

        <textarea
          value={threatInput}
          onChange={(e) => setThreatInput(e.target.value)}
          placeholder="Paste threat details, email content, URL, or suspicious message here..."
          className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />

        <Button
          onClick={analyzeThreat}
          disabled={loading}
          className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-slate-900"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Analyze with AI
        </Button>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
        )}
      </Card>

      {analysis && (
        <Card className="bg-slate-800/50 border-slate-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">Safety Assessment</h4>
            {analysis.isSafe ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-400" />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Safety Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-cyan-400">{analysis.safetyScore}</span>
                <span className="text-slate-400">/100</span>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Confidence Level</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-cyan-400">{(analysis.confidence * 100).toFixed(0)}</span>
                <span className="text-slate-400">%</span>
              </div>
            </div>
          </div>

          {analysis.riskFactors.length > 0 && (
            <div>
              <p className="text-white font-semibold mb-2">Risk Factors:</p>
              <ul className="space-y-1">
                {analysis.riskFactors.map((factor, i) => (
                  <li key={i} className="text-slate-300 text-sm flex gap-2">
                    <span className="text-red-400">•</span>
                    {factor}
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

          <div
            className={`p-3 rounded-lg text-sm ${
              analysis.isSafe
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {analysis.isSafe
              ? "This threat appears to be safe based on AI analysis."
              : "This threat is potentially dangerous. Exercise caution."}
          </div>
        </Card>
      )}
    </div>
  )
}
