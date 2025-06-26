"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Upload, Download, ImageIcon, Settings } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ImageConverter() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const [outputFormat, setOutputFormat] = useState("png")
  const [quality, setQuality] = useState([80])
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setOriginalImage(result)

      // Get original dimensions
      const img = new Image()
      img.onload = () => {
        setWidth(img.width.toString())
        setHeight(img.height.toString())
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  const convertImage = async () => {
    if (!originalImage || !canvasRef.current) return

    setIsProcessing(true)

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const newWidth = Number.parseInt(width) || img.width
        const newHeight = Number.parseInt(height) || img.height

        canvas.width = newWidth
        canvas.height = newHeight

        // Clear canvas and draw image
        ctx.clearRect(0, 0, newWidth, newHeight)
        ctx.drawImage(img, 0, 0, newWidth, newHeight)

        // Convert to desired format
        const mimeType = `image/${outputFormat}`
        const qualityValue = outputFormat === "jpeg" ? quality[0] / 100 : undefined

        const convertedDataUrl = canvas.toDataURL(mimeType, qualityValue)
        setConvertedImage(convertedDataUrl)

        toast({
          title: "Success!",
          description: `Image converted to ${outputFormat.toUpperCase()}`,
        })
      }

      img.src = originalImage
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert image",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = () => {
    if (!convertedImage) return

    const link = document.createElement("a")
    link.download = fileName.replace(/\.[^/.]+$/, `.${outputFormat}`)
    link.href = convertedImage
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleWidthChange = (value: string) => {
    setWidth(value)
    if (maintainAspectRatio && originalImage) {
      const img = new Image()
      img.onload = () => {
        const aspectRatio = img.height / img.width
        const newHeight = Math.round(Number.parseInt(value) * aspectRatio)
        setHeight(newHeight.toString())
      }
      img.src = originalImage
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Image Converter & Resizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Upload Image</Label>
              <div className="mt-2">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-32 border-dashed border-2 hover:border-blue-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span>Click to upload image</span>
                    <span className="text-sm text-gray-500">Supports JPG, PNG, GIF, WebP</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {originalImage && (
        <>
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Conversion Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    placeholder="Width"
                  />
                </div>

                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Height"
                  />
                </div>

                {outputFormat === "jpeg" && (
                  <div>
                    <Label>Quality: {quality[0]}%</Label>
                    <Slider value={quality} onValueChange={setQuality} max={100} min={1} step={1} className="mt-2" />
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-4">
                <Button onClick={convertImage} disabled={isProcessing}>
                  {isProcessing ? "Converting..." : "Convert Image"}
                </Button>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  />
                  Maintain aspect ratio
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={originalImage || "/placeholder.svg"}
                  alt="Original"
                  className="max-w-full h-auto rounded-lg border"
                />
              </CardContent>
            </Card>

            {convertedImage && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Converted Image</CardTitle>
                    <Button onClick={downloadImage} size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <img
                    src={convertedImage || "/placeholder.svg"}
                    alt="Converted"
                    className="max-w-full h-auto rounded-lg border"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}
