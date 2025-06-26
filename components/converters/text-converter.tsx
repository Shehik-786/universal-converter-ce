"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy, Type } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function TextConverter() {
  const [inputText, setInputText] = useState("Hello World! This is a sample text for conversion.")

  const convertToUpperCase = () => inputText.toUpperCase()
  const convertToLowerCase = () => inputText.toLowerCase()
  const convertToTitleCase = () => {
    return inputText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  }
  const convertToCamelCase = () => {
    return inputText
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
      .replace(/\s+/g, "")
  }
  const convertToSnakeCase = () => {
    return inputText
      .replace(/\W+/g, " ")
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join("_")
  }
  const convertToKebabCase = () => {
    return inputText
      .replace(/\W+/g, " ")
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join("-")
  }

  const encodeBase64 = () => {
    try {
      return btoa(inputText)
    } catch {
      return "Invalid input for Base64 encoding"
    }
  }

  const decodeBase64 = () => {
    try {
      return atob(inputText)
    } catch {
      return "Invalid Base64 string"
    }
  }

  const encodeURL = () => encodeURIComponent(inputText)
  const decodeURL = () => {
    try {
      return decodeURIComponent(inputText)
    } catch {
      return "Invalid URL encoded string"
    }
  }

  const reverseText = () => inputText.split("").reverse().join("")

  const getWordCount = () =>
    inputText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  const getCharCount = () => inputText.length
  const getCharCountNoSpaces = () => inputText.replace(/\s/g, "").length

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${format} copied to clipboard`,
    })
  }

  const conversions = [
    { name: "UPPERCASE", value: convertToUpperCase() },
    { name: "lowercase", value: convertToLowerCase() },
    { name: "Title Case", value: convertToTitleCase() },
    { name: "camelCase", value: convertToCamelCase() },
    { name: "snake_case", value: convertToSnakeCase() },
    { name: "kebab-case", value: convertToKebabCase() },
    { name: "Reversed", value: reverseText() },
  ]

  const encodings = [
    { name: "Base64 Encode", value: encodeBase64() },
    { name: "Base64 Decode", value: decodeBase64() },
    { name: "URL Encode", value: encodeURL() },
    { name: "URL Decode", value: decodeURL() },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Text Input
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="input-text">Enter your text</Label>
              <Textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to convert..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Words: {getWordCount()}</span>
              <span>Characters: {getCharCount()}</span>
              <span>Characters (no spaces): {getCharCountNoSpaces()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Case Conversions */}
      <Card>
        <CardHeader>
          <CardTitle>Case Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversions.map((conversion) => (
              <div key={conversion.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">{conversion.name}</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(conversion.value, conversion.name)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <Textarea value={conversion.value} readOnly className="min-h-[80px] bg-gray-50 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Encoding/Decoding */}
      <Card>
        <CardHeader>
          <CardTitle>Encoding & Decoding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {encodings.map((encoding) => (
              <div key={encoding.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">{encoding.name}</Label>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(encoding.value, encoding.name)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <Textarea value={encoding.value} readOnly className="min-h-[80px] bg-gray-50 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Text Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Text Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getWordCount()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{getCharCount()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{getCharCountNoSpaces()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">No Spaces</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {inputText.split("\n").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Lines</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
