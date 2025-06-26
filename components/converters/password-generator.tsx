"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Copy, RefreshCw, Shield, Key } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState([16])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)

  const generatePassword = () => {
    let charset = ""

    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "")
    }

    if (excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()/\\'"~,;<>.]/g, "")
    }

    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      return
    }

    let result = ""
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setPassword(result)
  }

  const copyToClipboard = () => {
    if (!password) return

    navigator.clipboard.writeText(password)
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    })
  }

  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: "No password", color: "text-gray-400" }

    let score = 0

    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 2) return { score, text: "Weak", color: "text-red-500" }
    if (score <= 4) return { score, text: "Medium", color: "text-yellow-500" }
    return { score, text: "Strong", color: "text-green-500" }
  }

  const generatePassphrase = () => {
    const words = [
      "apple",
      "banana",
      "cherry",
      "dragon",
      "elephant",
      "forest",
      "guitar",
      "harmony",
      "island",
      "jungle",
      "kitten",
      "lemon",
      "mountain",
      "ocean",
      "piano",
      "rainbow",
      "sunset",
      "thunder",
      "umbrella",
      "violet",
      "whisper",
      "yellow",
      "zebra",
      "crystal",
      "meadow",
      "river",
      "castle",
      "bridge",
      "garden",
      "flower",
      "butterfly",
      "starlight",
    ]

    const selectedWords = []
    for (let i = 0; i < 4; i++) {
      selectedWords.push(words[Math.floor(Math.random() * words.length)])
    }

    const passphrase = selectedWords.join("-") + Math.floor(Math.random() * 100)
    setPassword(passphrase)
  }

  const strength = getPasswordStrength()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Generated Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Generated Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={password}
              readOnly
              placeholder="Click 'Generate Password' to create a password"
              className="font-mono text-lg"
            />
            <Button onClick={copyToClipboard} disabled={!password} variant="outline">
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {password && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Strength:</span>
                <span className={`font-semibold ${strength.color}`}>{strength.text}</span>
              </div>
              <div className="text-sm text-gray-500">{password.length} characters</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Password Length: {length[0]}</Label>
            <Slider value={length} onValueChange={setLength} max={128} min={4} step={1} className="mt-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Include Characters</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                  <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                  <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                  <Label htmlFor="numbers">Numbers (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                  <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Exclude Characters</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="similar" checked={excludeSimilar} onCheckedChange={setExcludeSimilar} />
                  <Label htmlFor="similar">Similar (i, l, 1, L, o, 0, O)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="ambiguous" checked={excludeAmbiguous} onCheckedChange={setExcludeAmbiguous} />
                  <Label htmlFor="ambiguous">Ambiguous ({`{ } [ ] ( ) / \\ ' " ~ , ; < >`})</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generatePassword} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Password
            </Button>
            <Button onClick={generatePassphrase} variant="outline" className="flex-1">
              Generate Passphrase
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Password Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Use at least 12 characters</li>
                <li>• Include uppercase, lowercase, numbers, and symbols</li>
                <li>• Use unique passwords for each account</li>
                <li>• Consider using a password manager</li>
                <li>• Enable two-factor authentication</li>
                <li>• Update passwords regularly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-red-600 dark:text-red-400">Avoid</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Personal information (names, dates)</li>
                <li>• Dictionary words</li>
                <li>• Common patterns (123456, qwerty)</li>
                <li>• Reusing passwords across sites</li>
                <li>• Sharing passwords</li>
                <li>• Storing passwords in plain text</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
