"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, FileText, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function DocumentConverter() {
  const [inputText, setInputText] = useState("")
  const [outputFormat, setOutputFormat] = useState("txt")
  const [fileName, setFileName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsProcessing(true)

    try {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const text = await file.text()
        setInputText(text)
      } else if (file.type === "text/html" || file.name.endsWith(".html")) {
        const html = await file.text()
        // Simple HTML to text conversion
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = html
        setInputText(tempDiv.textContent || tempDiv.innerText || "")
      } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        const csv = await file.text()
        setInputText(csv)
      } else {
        // For other file types, try to read as text
        const text = await file.text()
        setInputText(text)
      }

      toast({
        title: "Success!",
        description: "File uploaded and processed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const convertDocument = () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text or upload a file",
        variant: "destructive",
      })
      return
    }

    let convertedContent = ""
    let mimeType = "text/plain"
    const fileExtension = outputFormat

    switch (outputFormat) {
      case "txt":
        convertedContent = inputText
        mimeType = "text/plain"
        break

      case "html":
        convertedContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1, h2, h3 { color: #333; }
        p { margin-bottom: 16px; }
    </style>
</head>
<body>
    ${inputText
      .split("\n")
      .map((line) => {
        if (line.trim() === "") return "<br>"
        if (line.startsWith("# ")) return `<h1>${line.substring(2)}</h1>`
        if (line.startsWith("## ")) return `<h2>${line.substring(3)}</h2>`
        if (line.startsWith("### ")) return `<h3>${line.substring(4)}</h3>`
        return `<p>${line}</p>`
      })
      .join("\n    ")}
</body>
</html>`
        mimeType = "text/html"
        break

      case "csv":
        // Simple text to CSV conversion (each line becomes a row with one column)
        const lines = inputText.split("\n").filter((line) => line.trim())
        convertedContent = "Content\n" + lines.map((line) => `"${line.replace(/"/g, '""')}"`).join("\n")
        mimeType = "text/csv"
        break

      case "json":
        const jsonData = {
          title: fileName || "Document",
          content: inputText,
          lines: inputText.split("\n"),
          wordCount: inputText.split(/\s+/).filter((word) => word.length > 0).length,
          characterCount: inputText.length,
          createdAt: new Date().toISOString(),
        }
        convertedContent = JSON.stringify(jsonData, null, 2)
        mimeType = "application/json"
        break

      case "md":
        // Simple text to Markdown conversion
        convertedContent = inputText
          .split("\n")
          .map((line) => {
            if (line.trim() === "") return ""
            if (line.length > 50 && !line.includes(".") && !line.includes(",")) {
              return `# ${line}`
            }
            return line
          })
          .join("\n")
        mimeType = "text/markdown"
        break

      default:
        convertedContent = inputText
    }

    downloadFile(convertedContent, mimeType, fileExtension)
  }

  const downloadFile = (content: string, mimeType: string, extension: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    const baseFileName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "document"
    link.download = `${baseFileName}.${extension}`
    link.href = url

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Success!",
      description: `Document converted and downloaded as ${extension.toUpperCase()}`,
    })
  }

  const formatOptions = [
    { value: "txt", label: "Plain Text (.txt)", description: "Simple text format" },
    { value: "html", label: "HTML (.html)", description: "Web page format" },
    { value: "csv", label: "CSV (.csv)", description: "Comma-separated values" },
    { value: "json", label: "JSON (.json)", description: "JavaScript Object Notation" },
    { value: "md", label: "Markdown (.md)", description: "Markdown format" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Upload Document</Label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.html,.csv,.md,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-24 border-dashed border-2 hover:border-blue-400"
                  disabled={isProcessing}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span>{isProcessing ? "Processing..." : "Click to upload document"}</span>
                    <span className="text-sm text-gray-500">Supports TXT, HTML, CSV, MD, JSON</span>
                  </div>
                </Button>
              </div>
            </div>

            {fileName && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{fileName}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Text Input */}
      <Card>
        <CardHeader>
          <CardTitle>Text Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here or upload a document above..."
              className="min-h-[300px]"
            />
            <div className="text-sm text-gray-500">
              {inputText.length} characters, {inputText.split(/\s+/).filter((word) => word.length > 0).length} words
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="output-format">Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={convertDocument} className="w-full" disabled={!inputText.trim()}>
              <Download className="w-4 h-4 mr-2" />
              Convert & Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Supported Formats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Input Formats</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Plain Text (.txt)</li>
                <li>• HTML (.html)</li>
                <li>• CSV (.csv)</li>
                <li>• Markdown (.md)</li>
                <li>• JSON (.json)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Output Formats</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Plain Text - Simple text format</li>
                <li>• HTML - Formatted web page</li>
                <li>• CSV - Spreadsheet compatible</li>
                <li>• JSON - Structured data format</li>
                <li>• Markdown - Documentation format</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
