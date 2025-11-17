"use client"

import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import ImageUpload from "@/components/ImageUpload"
import CodeEditor from "@/components/CodeEditor"
import CodePreview from "@/components/CodePreview"
import { Code2, Sparkles, Coins, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { data: session, status } = useSession()
  const [selectedImage, setSelectedImage] = useState<{
    file: File
    base64: string
  } | null>(null)
  const [generatedCode, setGeneratedCode] = useState("")
  const [codeType, setCodeType] = useState<"html" | "react">("html")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (file: File, base64: string) => {
    setSelectedImage({ file, base64 })
    setGeneratedCode("")
    setError(null)
  }

  const handleGenerate = async () => {
    if (!selectedImage) return

    if (status === "unauthenticated") {
      signIn()
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage.base64,
          codeType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate code")
      }

      setGeneratedCode(data.code)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Code2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Screenshot to Code
              </span>
            </div>
            <div className="flex items-center gap-4">
              {status === "authenticated" && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900 rounded-full">
                  <Coins className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {session.user.credits} credits
                  </span>
                </div>
              )}
              {status === "authenticated" ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!generatedCode ? (
          <div className="max-w-3xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Convert Screenshots to Code in Seconds
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Upload any design screenshot and get clean, production-ready HTML/CSS
                or React components powered by AI
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <ImageUpload
                onImageSelect={handleImageSelect}
                disabled={isGenerating}
              />

              {selectedImage && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Output Type
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setCodeType("html")}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                          codeType === "html"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="font-medium">HTML + Tailwind</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Static webpage
                        </div>
                      </button>
                      <button
                        onClick={() => setCodeType("react")}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                          codeType === "react"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="font-medium">React Component</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Reusable component
                        </div>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Code (1 credit)
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  AI-Powered
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advanced vision AI analyzes your design and generates pixel-perfect code
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Production-Ready
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Clean, semantic code with best practices and accessibility built-in
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Freemium Model
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  3 free credits to start, then affordable packages for more
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-12rem)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Generated Code
              </h2>
              <button
                onClick={() => {
                  setGeneratedCode("")
                  setSelectedImage(null)
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                New Generation
              </button>
            </div>
            <div className="grid lg:grid-cols-2 gap-4 h-full">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <CodeEditor
                  code={generatedCode}
                  onChange={(value) => setGeneratedCode(value || "")}
                  codeType={codeType}
                />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <CodePreview code={generatedCode} codeType={codeType} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
