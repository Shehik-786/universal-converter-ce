"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy, Palette } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6")
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  const updateFromHex = (hexValue: string) => {
    if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
      const newRgb = hexToRgb(hexValue)
      const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)
      setRgb(newRgb)
      setHsl(newHsl)
    }
  }

  const updateFromRgb = (newRgb: { r: number; g: number; b: number }) => {
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)
    setHex(newHex)
    setHsl(newHsl)
  }

  const updateFromHsl = (newHsl: { h: number; s: number; l: number }) => {
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setRgb(newRgb)
    setHex(newHex)
  }

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${format} value copied to clipboard`,
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Color Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-32 rounded-lg border-2 border-gray-200 dark:border-gray-700"
            style={{ backgroundColor: hex }}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* HEX */}
        <Card>
          <CardHeader>
            <CardTitle>HEX</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hex-input">Hex Value</Label>
              <div className="flex gap-2">
                <Input
                  id="hex-input"
                  type="text"
                  value={hex}
                  onChange={(e) => {
                    setHex(e.target.value)
                    updateFromHex(e.target.value)
                  }}
                  placeholder="#000000"
                />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(hex, "HEX")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="hex-color">Color Picker</Label>
              <input
                id="hex-color"
                type="color"
                value={hex}
                onChange={(e) => {
                  setHex(e.target.value)
                  updateFromHex(e.target.value)
                }}
                className="w-full h-10 rounded border"
              />
            </div>
          </CardContent>
        </Card>

        {/* RGB */}
        <Card>
          <CardHeader>
            <CardTitle>RGB</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="rgb-r">Red (0-255)</Label>
              <Input
                id="rgb-r"
                type="number"
                min="0"
                max="255"
                value={rgb.r}
                onChange={(e) => {
                  const newRgb = { ...rgb, r: Number.parseInt(e.target.value) || 0 }
                  setRgb(newRgb)
                  updateFromRgb(newRgb)
                }}
              />
            </div>
            <div>
              <Label htmlFor="rgb-g">Green (0-255)</Label>
              <Input
                id="rgb-g"
                type="number"
                min="0"
                max="255"
                value={rgb.g}
                onChange={(e) => {
                  const newRgb = { ...rgb, g: Number.parseInt(e.target.value) || 0 }
                  setRgb(newRgb)
                  updateFromRgb(newRgb)
                }}
              />
            </div>
            <div>
              <Label htmlFor="rgb-b">Blue (0-255)</Label>
              <Input
                id="rgb-b"
                type="number"
                min="0"
                max="255"
                value={rgb.b}
                onChange={(e) => {
                  const newRgb = { ...rgb, b: Number.parseInt(e.target.value) || 0 }
                  setRgb(newRgb)
                  updateFromRgb(newRgb)
                }}
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy RGB
            </Button>
          </CardContent>
        </Card>

        {/* HSL */}
        <Card>
          <CardHeader>
            <CardTitle>HSL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hsl-h">Hue (0-360)</Label>
              <Input
                id="hsl-h"
                type="number"
                min="0"
                max="360"
                value={hsl.h}
                onChange={(e) => {
                  const newHsl = { ...hsl, h: Number.parseInt(e.target.value) || 0 }
                  setHsl(newHsl)
                  updateFromHsl(newHsl)
                }}
              />
            </div>
            <div>
              <Label htmlFor="hsl-s">Saturation (0-100)</Label>
              <Input
                id="hsl-s"
                type="number"
                min="0"
                max="100"
                value={hsl.s}
                onChange={(e) => {
                  const newHsl = { ...hsl, s: Number.parseInt(e.target.value) || 0 }
                  setHsl(newHsl)
                  updateFromHsl(newHsl)
                }}
              />
            </div>
            <div>
              <Label htmlFor="hsl-l">Lightness (0-100)</Label>
              <Input
                id="hsl-l"
                type="number"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) => {
                  const newHsl = { ...hsl, l: Number.parseInt(e.target.value) || 0 }
                  setHsl(newHsl)
                  updateFromHsl(newHsl)
                }}
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy HSL
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
