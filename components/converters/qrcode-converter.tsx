"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Download, Copy } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function QRCodeConverter() {
  const [inputText, setInputText] = useState("https://example.com")
  const [qrCodeData, setQrCodeData] = useState("")
  const [qrSize, setQrSize] = useState("200")
  const [errorLevel, setErrorLevel] = useState("M")

  // Simple QR code generation using a public API (in production, use a proper library)
  const generateQRCode = () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text or URL to generate QR code",
        variant: "destructive",
      })
      return
    }

    const encodedText = encodeURIComponent(inputText)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodedText}&ecc=${errorLevel}`
    setQrCodeData(qrUrl)

    toast({
      title: "Success!",
      description: "QR code generated successfully",
    })
  }

  const downloadQRCode = async () => {
    if (!qrCodeData) return

    try {
      const response = await fetch(qrCodeData)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = "qrcode.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputText)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const presetTexts = [
    { label: "Website URL", value: "https://example.com" },
    { label: "Email", value: "mailto:contact@example.com" },
    { label: "Phone", value: "tel:+1234567890" },
    { label: "SMS", value: "sms:+1234567890" },
    { label: "WiFi", value: "WIFI:T:WPA;S:NetworkName;P:Password;;" },
    { label: "Location", value: "geo:37.7749,-122.4194" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="qr-text">Text or URL</Label>
            <Textarea
              id="qr-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text, URL, or data to encode..."
              className="min-h-[100px]"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">{inputText.length} characters</span>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="size">Size (px)</Label>
              <Select value={qrSize} onValueChange={setQrSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">150x150</SelectItem>
                  <SelectItem value="200">200x200</SelectItem>
                  <SelectItem value="300">300x300</SelectItem>
                  <SelectItem value="400">400x400</SelectItem>
                  <SelectItem value="500">500x500</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="error-level">Error Correction</Label>
              <Select value={errorLevel} onValueChange={setErrorLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={generateQRCode} className="w-full">
                Generate QR Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {presetTexts.map((preset) => (
              <Button key={preset.label} variant="outline" size="sm" onClick={() => setInputText(preset.value)}>
                {preset.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated QR Code */}
      {qrCodeData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated QR Code</CardTitle>
              <Button onClick={downloadQRCode} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img
                src={qrCodeData || "/placeholder.svg"}
                alt="Generated QR Code"
                className="border rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Encoded Data:</div>
              <div className="font-mono text-sm break-all">{inputText}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Common Use Cases:</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Website URLs</li>
                <li>• Contact information (vCard)</li>
                <li>• WiFi network credentials</li>
                <li>• Email addresses</li>
                <li>• Phone numbers</li>
                <li>• Geographic coordinates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Format Examples:</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400 font-mono text-xs">
                <li>• URL: https://example.com</li>
                <li>• Email: mailto:user@example.com</li>
                <li>• Phone: tel:+1234567890</li>
                <li>• SMS: sms:+1234567890</li>
                <li>• WiFi: WIFI:T:WPA;S:Name;P:Pass;;</li>
                <li>• Location: geo:lat,lng</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
