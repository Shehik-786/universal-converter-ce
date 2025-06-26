"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, ArrowRight, Database } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function DataConverter() {
  const [inputData, setInputData] = useState(`{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming", "coding"]
}`)
  const [outputData, setOutputData] = useState("")
  const [inputFormat, setInputFormat] = useState("json")
  const [outputFormat, setOutputFormat] = useState("xml")

  const convertData = () => {
    try {
      let parsedData: any

      // Parse input data
      switch (inputFormat) {
        case "json":
          parsedData = JSON.parse(inputData)
          break
        case "csv":
          parsedData = parseCSV(inputData)
          break
        case "xml":
          parsedData = parseXML(inputData)
          break
        case "yaml":
          parsedData = parseYAML(inputData)
          break
        default:
          throw new Error("Unsupported input format")
      }

      // Convert to output format
      let result: string
      switch (outputFormat) {
        case "json":
          result = JSON.stringify(parsedData, null, 2)
          break
        case "csv":
          result = convertToCSV(parsedData)
          break
        case "xml":
          result = convertToXML(parsedData)
          break
        case "yaml":
          result = convertToYAML(parsedData)
          break
        default:
          throw new Error("Unsupported output format")
      }

      setOutputData(result)
      toast({
        title: "Success!",
        description: `Converted from ${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: `Failed to convert data: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const parseCSV = (csv: string) => {
    const lines = csv.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())
    const data = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim())
      const obj: any = {}
      headers.forEach((header, index) => {
        obj[header] = values[index] || ""
      })
      return obj
    })
    return data
  }

  const parseXML = (xml: string) => {
    // Simple XML parser (for demo - use a proper XML parser in production)
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, "text/xml")
    return xmlToObject(doc.documentElement)
  }

  const xmlToObject = (element: Element): any => {
    const obj: any = {}

    // Handle attributes
    if (element.attributes.length > 0) {
      obj["@attributes"] = {}
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i]
        obj["@attributes"][attr.name] = attr.value
      }
    }

    // Handle child elements
    if (element.children.length > 0) {
      for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i]
        const childObj = xmlToObject(child)

        if (obj[child.tagName]) {
          if (!Array.isArray(obj[child.tagName])) {
            obj[child.tagName] = [obj[child.tagName]]
          }
          obj[child.tagName].push(childObj)
        } else {
          obj[child.tagName] = childObj
        }
      }
    } else {
      // Handle text content
      const text = element.textContent?.trim()
      if (text) {
        return text
      }
    }

    return obj
  }

  const parseYAML = (yaml: string) => {
    // Simple YAML parser (for demo - use js-yaml in production)
    const lines = yaml.split("\n")
    const obj: any = {}
    let currentKey = ""

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue

      if (line.includes(":")) {
        const [key, value] = line.split(":").map((s) => s.trim())
        if (value) {
          obj[key] = isNaN(Number(value)) ? value : Number(value)
        } else {
          currentKey = key
          obj[key] = {}
        }
      }
    }

    return obj
  }

  const convertToCSV = (data: any) => {
    if (!Array.isArray(data)) {
      data = [data]
    }

    if (data.length === 0) return ""

    const headers = Object.keys(data[0])
    const csvHeaders = headers.join(",")
    const csvRows = data.map((row: any) =>
      headers
        .map((header) => {
          const value = row[header]
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value
        })
        .join(","),
    )

    return [csvHeaders, ...csvRows].join("\n")
  }

  const convertToXML = (data: any, rootName = "root") => {
    const convertValue = (obj: any, name: string): string => {
      if (typeof obj === "object" && obj !== null) {
        if (Array.isArray(obj)) {
          return obj.map((item, index) => convertValue(item, `${name}_${index}`)).join("")
        } else {
          const children = Object.entries(obj)
            .map(([key, value]) => convertValue(value, key))
            .join("")
          return `<${name}>${children}</${name}>`
        }
      } else {
        return `<${name}>${obj}</${name}>`
      }
    }

    return `<?xml version="1.0" encoding="UTF-8"?>\n${convertValue(data, rootName)}`
  }

  const convertToYAML = (data: any, indent = 0) => {
    const spaces = "  ".repeat(indent)

    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        return data.map((item) => `${spaces}- ${convertToYAML(item, 0)}`).join("\n")
      } else {
        return Object.entries(data)
          .map(([key, value]) => {
            if (typeof value === "object" && value !== null) {
              return `${spaces}${key}:\n${convertToYAML(value, indent + 1)}`
            } else {
              return `${spaces}${key}: ${value}`
            }
          })
          .join("\n")
      }
    } else {
      return String(data)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputData)
    toast({
      title: "Copied!",
      description: "Converted data copied to clipboard",
    })
  }

  const sampleData = {
    json: `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "active": true
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "active": false
    }
  ]
}`,
    csv: `name,age,city,country
John Doe,30,New York,USA
Jane Smith,25,London,UK
Bob Johnson,35,Toronto,Canada`,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user id="1">
    <name>John Doe</name>
    <email>john@example.com</email>
    <active>true</active>
  </user>
  <user id="2">
    <name>Jane Smith</name>
    <email>jane@example.com</email>
    <active>false</active>
  </user>
</users>`,
    yaml: `users:
  - id: 1
    name: John Doe
    email: john@example.com
    active: true
  - id: 2
    name: Jane Smith
    email: jane@example.com
    active: false`,
  }

  const loadSample = (format: string) => {
    setInputData(sampleData[format as keyof typeof sampleData])
    setInputFormat(format)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Conversion Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Format Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Label>From Format</Label>
              <Select value={inputFormat} onValueChange={setInputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="yaml">YAML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400 mt-6" />

            <div className="flex-1">
              <Label>To Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="yaml">YAML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={convertData} className="flex-1">
              Convert Data
            </Button>
            <Button variant="outline" onClick={() => loadSample(inputFormat)}>
              Load Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input ({inputFormat.toUpperCase()})</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder={`Enter ${inputFormat.toUpperCase()} data...`}
              className="min-h-[400px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Output ({outputFormat.toUpperCase()})</CardTitle>
              {outputData && (
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={outputData}
              readOnly
              placeholder="Converted data will appear here..."
              className="min-h-[400px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
            />
          </CardContent>
        </Card>
      </div>

      {/* Format Information */}
      <Card>
        <CardHeader>
          <CardTitle>Format Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">JSON</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                JavaScript Object Notation - lightweight data interchange format
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">XML</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Extensible Markup Language - structured document format
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">CSV</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Comma-Separated Values - tabular data format</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">YAML</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                YAML Ain't Markup Language - human-readable data serialization
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
