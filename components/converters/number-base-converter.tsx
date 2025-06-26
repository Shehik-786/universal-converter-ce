"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function NumberBaseConverter() {
  const [decimal, setDecimal] = useState("255")
  const [binary, setBinary] = useState("11111111")
  const [hexadecimal, setHexadecimal] = useState("FF")
  const [octal, setOctal] = useState("377")

  const updateFromDecimal = (value: string) => {
    const num = Number.parseInt(value) || 0
    setBinary(num.toString(2))
    setHexadecimal(num.toString(16).toUpperCase())
    setOctal(num.toString(8))
  }

  const updateFromBinary = (value: string) => {
    if (/^[01]*$/.test(value)) {
      const num = Number.parseInt(value, 2) || 0
      setDecimal(num.toString())
      setHexadecimal(num.toString(16).toUpperCase())
      setOctal(num.toString(8))
    }
  }

  const updateFromHex = (value: string) => {
    if (/^[0-9A-Fa-f]*$/.test(value)) {
      const num = Number.parseInt(value, 16) || 0
      setDecimal(num.toString())
      setBinary(num.toString(2))
      setOctal(num.toString(8))
    }
  }

  const updateFromOctal = (value: string) => {
    if (/^[0-7]*$/.test(value)) {
      const num = Number.parseInt(value, 8) || 0
      setDecimal(num.toString())
      setBinary(num.toString(2))
      setHexadecimal(num.toString(16).toUpperCase())
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decimal */}
        <Card>
          <CardHeader>
            <CardTitle>Decimal (Base 10)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="decimal">Decimal Value</Label>
              <Input
                id="decimal"
                type="number"
                value={decimal}
                onChange={(e) => {
                  setDecimal(e.target.value)
                  updateFromDecimal(e.target.value)
                }}
                placeholder="Enter decimal number"
              />
            </div>
            <Button variant="outline" className="w-full" onClick={() => copyToClipboard(decimal, "Decimal")}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Decimal
            </Button>
          </CardContent>
        </Card>

        {/* Binary */}
        <Card>
          <CardHeader>
            <CardTitle>Binary (Base 2)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="binary">Binary Value</Label>
              <Input
                id="binary"
                type="text"
                value={binary}
                onChange={(e) => {
                  setBinary(e.target.value)
                  updateFromBinary(e.target.value)
                }}
                placeholder="Enter binary number (0s and 1s)"
              />
            </div>
            <Button variant="outline" className="w-full" onClick={() => copyToClipboard(binary, "Binary")}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Binary
            </Button>
          </CardContent>
        </Card>

        {/* Hexadecimal */}
        <Card>
          <CardHeader>
            <CardTitle>Hexadecimal (Base 16)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hex">Hexadecimal Value</Label>
              <Input
                id="hex"
                type="text"
                value={hexadecimal}
                onChange={(e) => {
                  setHexadecimal(e.target.value.toUpperCase())
                  updateFromHex(e.target.value)
                }}
                placeholder="Enter hex number (0-9, A-F)"
              />
            </div>
            <Button variant="outline" className="w-full" onClick={() => copyToClipboard(hexadecimal, "Hexadecimal")}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Hex
            </Button>
          </CardContent>
        </Card>

        {/* Octal */}
        <Card>
          <CardHeader>
            <CardTitle>Octal (Base 8)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="octal">Octal Value</Label>
              <Input
                id="octal"
                type="text"
                value={octal}
                onChange={(e) => {
                  setOctal(e.target.value)
                  updateFromOctal(e.target.value)
                }}
                placeholder="Enter octal number (0-7)"
              />
            </div>
            <Button variant="outline" className="w-full" onClick={() => copyToClipboard(octal, "Octal")}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Octal
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold">Decimal</div>
              <div className="text-gray-600 dark:text-gray-400">0-9</div>
            </div>
            <div>
              <div className="font-semibold">Binary</div>
              <div className="text-gray-600 dark:text-gray-400">0-1</div>
            </div>
            <div>
              <div className="font-semibold">Octal</div>
              <div className="text-gray-600 dark:text-gray-400">0-7</div>
            </div>
            <div>
              <div className="font-semibold">Hexadecimal</div>
              <div className="text-gray-600 dark:text-gray-400">0-9, A-F</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
