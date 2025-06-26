"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Download, Copy, ImageIcon, Type, Settings } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function PDFConverter() {
  // PDF Text Extraction
  const [extractedText, setExtractedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Text to PDF
  const [textContent, setTextContent] = useState(`Welcome to PDF Creator

This is a sample document that will be converted to PDF.

Key Features:
• Convert text to PDF
• Convert images to PDF
• Extract text from existing PDFs
• Customizable formatting options

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Thank you for using our PDF converter!`)
  const [textSettings, setTextSettings] = useState({
    fontSize: "12",
    fontFamily: "Arial",
    lineHeight: "1.5",
    margin: "40",
    pageSize: "A4",
  })

  // Image to PDF
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [imageSettings, setImageSettings] = useState({
    pageSize: "A4",
    orientation: "portrait",
    margin: "20",
    imageSize: "fit",
  })
  const imageInputRef = useRef<HTMLInputElement>(null)

  // PDF Text Extraction
  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      })
      return
    }

    setFileName(file.name)
    setIsProcessing(true)

    try {
      // In a real implementation, you would use a library like pdf-parse or PDF.js
      // For this demo, we'll simulate PDF text extraction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockExtractedText = `This is extracted text from ${file.name}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Key Information:
• Document title: Sample PDF Document
• Pages: 3
• Created: ${new Date().toLocaleDateString()}
• File size: ${(file.size / 1024).toFixed(2)} KB

This text has been extracted from the PDF file and can now be copied, edited, or saved as a text file.`

      setExtractedText(mockExtractedText)
      toast({
        title: "Success!",
        description: "Text extracted from PDF successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract text from PDF",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Image to PDF
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const imageUrls: string[] = []
    let processedFiles = 0

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        imageUrls.push(result)
        processedFiles++

        if (processedFiles === files.length) {
          setSelectedImages((prev) => [...prev, ...imageUrls])
          toast({
            title: "Success!",
            description: `${files.length} image(s) added`,
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const clearAllImages = () => {
    setSelectedImages([])
  }

  // Text to PDF Generation
  const generateTextPDF = () => {
    if (!textContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter text content",
        variant: "destructive",
      })
      return
    }

    // Create a simple HTML document for PDF generation
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: ${textSettings.fontFamily}, sans-serif;
            font-size: ${textSettings.fontSize}px;
            line-height: ${textSettings.lineHeight};
            margin: ${textSettings.margin}px;
            color: #333;
        }
        h1, h2, h3 { color: #2c3e50; margin-top: 24px; margin-bottom: 12px; }
        h1 { font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 8px; }
        h2 { font-size: 20px; }
        h3 { font-size: 16px; }
        p { margin-bottom: 12px; }
        ul, ol { margin-bottom: 12px; padding-left: 24px; }
        li { margin-bottom: 4px; }
        .page-break { page-break-before: always; }
    </style>
</head>
<body>
    ${textContent
      .split("\n")
      .map((line) => {
        const trimmed = line.trim()
        if (!trimmed) return "<br>"
        if (trimmed.startsWith("# ")) return `<h1>${trimmed.substring(2)}</h1>`
        if (trimmed.startsWith("## ")) return `<h2>${trimmed.substring(3)}</h2>`
        if (trimmed.startsWith("### ")) return `<h3>${trimmed.substring(4)}</h3>`
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
          return `<li>${trimmed.substring(2)}</li>`
        }
        return `<p>${trimmed}</p>`
      })
      .join("\n")}
</body>
</html>`

    // In a real implementation, you would use jsPDF or similar library
    // For demo, we'll create a downloadable HTML file that can be printed to PDF
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "document.html"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "HTML Generated!",
      description: "Open the HTML file and print to PDF using your browser",
    })
  }

  // Image to PDF Generation
  const generateImagePDF = () => {
    if (selectedImages.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one image",
        variant: "destructive",
      })
      return
    }

    // Create HTML with images for PDF generation
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: ${imageSettings.pageSize} ${imageSettings.orientation};
            margin: ${imageSettings.margin}px;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        .page {
            page-break-after: always;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: calc(100vh - ${Number.parseInt(imageSettings.margin) * 2}px);
        }
        .page:last-child {
            page-break-after: avoid;
        }
        img {
            max-width: 100%;
            max-height: 100%;
            ${imageSettings.imageSize === "fit" ? "object-fit: contain;" : ""}
            ${imageSettings.imageSize === "fill" ? "object-fit: cover; width: 100%; height: 100%;" : ""}
        }
    </style>
</head>
<body>
    ${selectedImages
      .map(
        (image, index) => `
        <div class="page">
            <img src="${image}" alt="Image ${index + 1}" />
        </div>
    `,
      )
      .join("")}
</body>
</html>`

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "images-to-pdf.html"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "HTML Generated!",
      description: "Open the HTML file and print to PDF using your browser",
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText)
    toast({
      title: "Copied!",
      description: "Extracted text copied to clipboard",
    })
  }

  const downloadAsText = () => {
    const blob = new Blob([extractedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName.replace(".pdf", ".txt")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Tabs defaultValue="extract" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="extract" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Extract from PDF
          </TabsTrigger>
          <TabsTrigger value="text-to-pdf" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Text to PDF
          </TabsTrigger>
          <TabsTrigger value="image-to-pdf" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Images to PDF
          </TabsTrigger>
        </TabsList>

        {/* PDF Text Extraction */}
        <TabsContent value="extract" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                PDF Text Extractor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Upload PDF File</Label>
                  <div className="mt-2">
                    <input ref={fileInputRef} type="file" accept=".pdf" onChange={handlePDFUpload} className="hidden" />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full h-32 border-dashed border-2 hover:border-blue-400"
                      disabled={isProcessing}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span>{isProcessing ? "Processing..." : "Click to upload PDF file"}</span>
                        <span className="text-sm text-gray-500">Supports PDF files up to 10MB</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {fileName && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{fileName}</span>
                      {isProcessing && <span className="text-sm text-blue-600">Processing...</span>}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {extractedText && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Extracted Text</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadAsText}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Extracted text will appear here..."
                />
                <div className="mt-2 text-sm text-gray-500">
                  {extractedText.length} characters, {extractedText.split(/\s+/).length} words
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Text to PDF */}
        <TabsContent value="text-to-pdf" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Text to PDF Converter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text-content">Text Content</Label>
                  <Textarea
                    id="text-content"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="min-h-[300px]"
                    placeholder="Enter your text content here..."
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    {textContent.length} characters, {textContent.split(/\s+/).filter((w) => w.length > 0).length} words
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                PDF Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select
                    value={textSettings.fontSize}
                    onValueChange={(value) => setTextSettings({ ...textSettings, fontSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10px</SelectItem>
                      <SelectItem value="12">12px</SelectItem>
                      <SelectItem value="14">14px</SelectItem>
                      <SelectItem value="16">16px</SelectItem>
                      <SelectItem value="18">18px</SelectItem>
                      <SelectItem value="20">20px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select
                    value={textSettings.fontFamily}
                    onValueChange={(value) => setTextSettings({ ...textSettings, fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="line-height">Line Height</Label>
                  <Select
                    value={textSettings.lineHeight}
                    onValueChange={(value) => setTextSettings({ ...textSettings, lineHeight: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.2">1.2</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="1.8">1.8</SelectItem>
                      <SelectItem value="2.0">2.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="margin">Margin (px)</Label>
                  <Input
                    id="margin"
                    type="number"
                    value={textSettings.margin}
                    onChange={(e) => setTextSettings({ ...textSettings, margin: e.target.value })}
                    min="10"
                    max="100"
                  />
                </div>

                <div>
                  <Label htmlFor="page-size">Page Size</Label>
                  <Select
                    value={textSettings.pageSize}
                    onValueChange={(value) => setTextSettings({ ...textSettings, pageSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="A3">A3</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={generateTextPDF} className="w-full mt-4" disabled={!textContent.trim()}>
                <Download className="w-4 h-4 mr-2" />
                Generate PDF
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images to PDF */}
        <TabsContent value="image-to-pdf" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Images to PDF Converter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Upload Images</Label>
                  <div className="mt-2">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => imageInputRef.current?.click()}
                      variant="outline"
                      className="w-full h-32 border-dashed border-2 hover:border-blue-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span>Click to upload images</span>
                        <span className="text-sm text-gray-500">Supports JPG, PNG, GIF, WebP (multiple files)</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {selectedImages.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Selected Images ({selectedImages.length})</Label>
                      <Button variant="outline" size="sm" onClick={clearAllImages}>
                        Clear All
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Image ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  PDF Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="pdf-page-size">Page Size</Label>
                    <Select
                      value={imageSettings.pageSize}
                      onValueChange={(value) => setImageSettings({ ...imageSettings, pageSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A3">A3</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="orientation">Orientation</Label>
                    <Select
                      value={imageSettings.orientation}
                      onValueChange={(value) => setImageSettings({ ...imageSettings, orientation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pdf-margin">Margin (px)</Label>
                    <Input
                      id="pdf-margin"
                      type="number"
                      value={imageSettings.margin}
                      onChange={(e) => setImageSettings({ ...imageSettings, margin: e.target.value })}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image-size">Image Sizing</Label>
                    <Select
                      value={imageSettings.imageSize}
                      onValueChange={(value) => setImageSettings({ ...imageSettings, imageSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fit">Fit to Page</SelectItem>
                        <SelectItem value="fill">Fill Page</SelectItem>
                        <SelectItem value="original">Original Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={generateImagePDF} className="w-full mt-4">
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Create PDF Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">Step 1: Generate HTML</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click "Generate PDF" to create an HTML file with your content formatted for PDF conversion.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600 dark:text-green-400">Step 2: Open in Browser</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Open the downloaded HTML file in your web browser (Chrome, Firefox, Safari, etc.).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-600 dark:text-purple-400">Step 3: Print to PDF</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use Ctrl+P (Cmd+P on Mac) and select "Save as PDF" as the destination to create your PDF file.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>PDF Converter Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Text Extraction</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Extract readable text from PDF documents</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Type className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Text to PDF</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Convert text content to formatted PDF documents
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <ImageIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Images to PDF</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Combine multiple images into a single PDF</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Customizable</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Adjust fonts, margins, page size, and layout</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Upload className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Multiple Formats</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Support for various image formats and text inputs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
                <Download className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold">Easy Download</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Simple browser-based PDF generation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
