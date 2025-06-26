"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
]

export default function DateTimeConverter() {
  const [timestamp, setTimestamp] = useState("")
  const [humanDate, setHumanDate] = useState("")
  const [timezone, setTimezone] = useState("UTC")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Initialize with current timestamp
    const now = Date.now()
    setTimestamp(Math.floor(now / 1000).toString())
    updateHumanDate(Math.floor(now / 1000).toString())
  }, [])

  const updateHumanDate = (ts: string) => {
    const timestampNum = Number.parseInt(ts)
    if (!isNaN(timestampNum)) {
      const date = new Date(timestampNum * 1000)
      setHumanDate(date.toISOString().slice(0, 16))
    }
  }

  const updateTimestamp = (dateStr: string) => {
    if (dateStr) {
      const date = new Date(dateStr)
      const ts = Math.floor(date.getTime() / 1000)
      setTimestamp(ts.toString())
    }
  }

  const formatDateInTimezone = (date: Date, tz: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date)
    } catch {
      return date.toISOString()
    }
  }

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${format} copied to clipboard`,
    })
  }

  const getCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000)
    setTimestamp(now.toString())
    updateHumanDate(now.toString())
  }

  const timestampDate = timestamp ? new Date(Number.parseInt(timestamp) * 1000) : new Date()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Current Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Current Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Timestamp</div>
              <div className="text-lg font-mono">{Math.floor(currentTime.getTime() / 1000)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Date & Time</div>
              <div className="text-lg">{currentTime.toLocaleString()}</div>
            </div>
          </div>
          <Button onClick={getCurrentTimestamp} className="mt-4">
            Use Current Time
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unix Timestamp */}
        <Card>
          <CardHeader>
            <CardTitle>Unix Timestamp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timestamp">Timestamp (seconds since epoch)</Label>
              <Input
                id="timestamp"
                type="number"
                value={timestamp}
                onChange={(e) => {
                  setTimestamp(e.target.value)
                  updateHumanDate(e.target.value)
                }}
                placeholder="Enter Unix timestamp"
              />
            </div>
            <Button variant="outline" className="w-full" onClick={() => copyToClipboard(timestamp, "Timestamp")}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Timestamp
            </Button>
          </CardContent>
        </Card>

        {/* Human Readable Date */}
        <Card>
          <CardHeader>
            <CardTitle>Human Readable Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="human-date">Date & Time</Label>
              <Input
                id="human-date"
                type="datetime-local"
                value={humanDate}
                onChange={(e) => {
                  setHumanDate(e.target.value)
                  updateTimestamp(e.target.value)
                }}
              />
            </div>
            <Button variant="outline" className="w-full" onClick={() => copyToClipboard(humanDate, "Date")}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Date
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Timezone Converter */}
      <Card>
        <CardHeader>
          <CardTitle>Timezone Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="timezone">Select Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">UTC Time</div>
              <div className="font-mono">{timestampDate.toISOString().replace("T", " ").slice(0, 19)} UTC</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Selected Timezone</div>
              <div className="font-mono">{formatDateInTimezone(timestampDate, timezone)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Format Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Format Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-2">Common Formats</div>
              <div className="space-y-1">
                <div>
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">
                    {timestampDate.toISOString()}
                  </span>{" "}
                  - ISO 8601
                </div>
                <div>
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">
                    {timestampDate.toLocaleDateString()}
                  </span>{" "}
                  - Local Date
                </div>
                <div>
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">
                    {timestampDate.toLocaleTimeString()}
                  </span>{" "}
                  - Local Time
                </div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Timestamps</div>
              <div className="space-y-1">
                <div>
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">
                    {Math.floor(timestampDate.getTime() / 1000)}
                  </span>{" "}
                  - Unix (seconds)
                </div>
                <div>
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{timestampDate.getTime()}</span>{" "}
                  - JavaScript (milliseconds)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
