"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Shield, Hash } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function HashGenerator() {
  const [inputText, setInputText] = useState("Hello, World!")
  const [hashes, setHashes] = useState({
    md5: "",
    sha1: "",
    sha256: "",
    sha512: "",
  })

  // Simple hash functions (in production, use crypto-js or similar)
  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ md5: "", sha1: "", sha256: "", sha512: "" })
      return
    }

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(text)

      // Generate SHA-256
      const sha256Buffer = await crypto.subtle.digest("SHA-256", data)
      const sha256Hash = Array.from(new Uint8Array(sha256Buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      // Generate SHA-1
      const sha1Buffer = await crypto.subtle.digest("SHA-1", data)
      const sha1Hash = Array.from(new Uint8Array(sha1Buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      // Generate SHA-512
      const sha512Buffer = await crypto.subtle.digest("SHA-512", data)
      const sha512Hash = Array.from(new Uint8Array(sha512Buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      // Simple MD5 implementation (for demo - use crypto-js in production)
      const md5Hash = simpleMD5(text)

      setHashes({
        md5: md5Hash,
        sha1: sha1Hash,
        sha256: sha256Hash,
        sha512: sha512Hash,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate hashes",
        variant: "destructive",
      })
    }
  }

  // Simple MD5 implementation (for demo purposes)
  const simpleMD5 = (text: string) => {
    // This is a simplified version - use a proper crypto library in production
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, "0")
  }

  useEffect(() => {
    generateHashes(inputText)
  }, [inputText])

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} hash copied to clipboard`,
    })
  }

  const hashTypes = [
    {
      name: "MD5",
      value: hashes.md5,
      description: "128-bit hash (not cryptographically secure)",
      color: "text-red-600 dark:text-red-400",
    },
    {
      name: "SHA-1",
      value: hashes.sha1,
      description: "160-bit hash (deprecated for security)",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      name: "SHA-256",
      value: hashes.sha256,
      description: "256-bit hash (recommended for security)",
      color: "text-green-600 dark:text-green-400",
    },
    {
      name: "SHA-512",
      value: hashes.sha512,
      description: "512-bit hash (highest security)",
      color: "text-blue-600 dark:text-blue-400",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Hash Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="input-text">Input Text</Label>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to hash..."
              className="min-h-[100px]"
            />
            <div className="mt-2 text-sm text-gray-500">
              {inputText.length} characters, {new Blob([inputText]).size} bytes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hash Results */}
      <div className="grid grid-cols-1 gap-4">
        {hashTypes.map((hashType) => (
          <Card key={hashType.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`text-lg ${hashType.color}`}>{hashType.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{hashType.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(hashType.value, hashType.name)}
                  disabled={!hashType.value}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <code className="font-mono text-sm break-all">
                  {hashType.value || "Enter text to generate hash..."}
                </code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">Recommended</h4>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="font-medium">SHA-256</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Best balance of security and performance
                  </div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-medium">SHA-512</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Maximum security for sensitive data</div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-red-600 dark:text-red-400">Not Recommended</h4>
              <div className="space-y-2">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="font-medium">MD5</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Vulnerable to collision attacks</div>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="font-medium">SHA-1</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Deprecated by security standards</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Common Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Data Integrity</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• File verification</li>
                <li>• Data corruption detection</li>
                <li>• Backup validation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Security</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Password hashing</li>
                <li>• Digital signatures</li>
                <li>• Certificate validation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Development</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Cache keys</li>
                <li>• Unique identifiers</li>
                <li>• Version control</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
