"use client"

import { useState } from "react"
import { Search, Calculator, Palette, Clock, FileText, DollarSign, Ruler, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import UnitConverter from "@/components/converters/unit-converter"
import CurrencyConverter from "@/components/converters/currency-converter"
import ColorConverter from "@/components/converters/color-converter"
import NumberBaseConverter from "@/components/converters/number-base-converter"
import DateTimeConverter from "@/components/converters/datetime-converter"
import TextConverter from "@/components/converters/text-converter"
import PDFConverter from "@/components/converters/pdf-converter"
import ImageConverter from "@/components/converters/image-converter"
import DocumentConverter from "@/components/converters/document-converter"
import QRCodeConverter from "@/components/converters/qrcode-converter"
import HashGenerator from "@/components/converters/hash-generator"
import PasswordGenerator from "@/components/converters/password-generator"
import DataConverter from "@/components/converters/data-converter"
import MarkdownConverter from "@/components/converters/markdown-converter"

const converterCategories = [
  {
    id: "units",
    title: "Unit Converter",
    description: "Convert between different units of measurement",
    icon: Ruler,
    tags: ["length", "weight", "temperature", "area", "volume"],
    component: UnitConverter,
  },
  {
    id: "currency",
    title: "Currency Converter",
    description: "Convert between different currencies with live rates",
    icon: DollarSign,
    tags: ["money", "exchange", "forex"],
    component: CurrencyConverter,
  },
  {
    id: "pdf",
    title: "PDF Converter",
    description: "Extract text from PDF, convert images/text to PDF",
    icon: FileText,
    tags: ["pdf", "text", "extract", "document", "image", "create"],
    component: PDFConverter,
  },
  {
    id: "image",
    title: "Image Converter",
    description: "Convert, resize, and optimize images",
    icon: Palette,
    tags: ["image", "resize", "format", "optimize"],
    component: ImageConverter,
  },
  {
    id: "document",
    title: "Document Converter",
    description: "Convert between document formats",
    icon: FileText,
    tags: ["doc", "docx", "txt", "rtf"],
    component: DocumentConverter,
  },
  {
    id: "qrcode",
    title: "QR Code Generator",
    description: "Generate and read QR codes",
    icon: Zap,
    tags: ["qr", "barcode", "generate", "scan"],
    component: QRCodeConverter,
  },
  {
    id: "hash",
    title: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 hashes",
    icon: Calculator,
    tags: ["hash", "md5", "sha1", "sha256", "security"],
    component: HashGenerator,
  },
  {
    id: "password",
    title: "Password Generator",
    description: "Generate secure passwords and passphrases",
    icon: Zap,
    tags: ["password", "security", "generate", "random"],
    component: PasswordGenerator,
  },
  {
    id: "data",
    title: "Data Converter",
    description: "Convert between JSON, XML, CSV, YAML",
    icon: FileText,
    tags: ["json", "xml", "csv", "yaml", "data"],
    component: DataConverter,
  },
  {
    id: "markdown",
    title: "Markdown Converter",
    description: "Convert Markdown to HTML and vice versa",
    icon: FileText,
    tags: ["markdown", "html", "text", "format"],
    component: MarkdownConverter,
  },
  {
    id: "color",
    title: "Color Converter",
    description: "Convert between color formats (HEX, RGB, HSL)",
    icon: Palette,
    tags: ["hex", "rgb", "hsl", "design"],
    component: ColorConverter,
  },
  {
    id: "number",
    title: "Number Base Converter",
    description: "Convert between binary, decimal, hexadecimal",
    icon: Calculator,
    tags: ["binary", "decimal", "hex", "programming"],
    component: NumberBaseConverter,
  },
  {
    id: "datetime",
    title: "Date & Time Converter",
    description: "Convert timestamps, timezones, and date formats",
    icon: Clock,
    tags: ["timestamp", "timezone", "unix"],
    component: DateTimeConverter,
  },
  {
    id: "text",
    title: "Text Converter",
    description: "Convert text encoding, case, and formats",
    icon: FileText,
    tags: ["encoding", "case", "base64", "url"],
    component: TextConverter,
  },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConverter, setSelectedConverter] = useState<string | null>(null)

  const filteredConverters = converterCategories.filter(
    (converter) =>
      converter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      converter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      converter.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const selectedConverterData = converterCategories.find((c) => c.id === selectedConverter)

  if (selectedConverter && selectedConverterData) {
    const ConverterComponent = selectedConverterData.component
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedConverter(null)}
              className="text-blue-600 hover:text-blue-800 font-medium mb-4"
            >
              ← Back to Converters
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedConverterData.title}</h1>
            <p className="text-gray-600 dark:text-gray-300">{selectedConverterData.description}</p>
          </div>
          <ConverterComponent />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Universal Converter</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Convert anything to anything - your all-in-one conversion toolkit
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search converters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Converter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConverters.map((converter) => {
            const IconComponent = converter.icon
            return (
              <Card
                key={converter.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedConverter(converter.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">{converter.title}</CardTitle>
                  </div>
                  <CardDescription>{converter.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {converter.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredConverters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No converters found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Features */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Why Choose Universal Converter?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">Instant conversions with real-time results</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                <Calculator className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Accurate Results</h3>
              <p className="text-gray-600 dark:text-gray-300">Precise calculations with up-to-date conversion rates</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
                <FileText className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Multiple Formats</h3>
              <p className="text-gray-600 dark:text-gray-300">Support for all major units, currencies, and formats</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
