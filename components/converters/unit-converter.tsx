"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

const unitCategories = {
  length: {
    name: "Length",
    units: {
      meter: { name: "Meter", factor: 1 },
      kilometer: { name: "Kilometer", factor: 1000 },
      centimeter: { name: "Centimeter", factor: 0.01 },
      millimeter: { name: "Millimeter", factor: 0.001 },
      inch: { name: "Inch", factor: 0.0254 },
      foot: { name: "Foot", factor: 0.3048 },
      yard: { name: "Yard", factor: 0.9144 },
      mile: { name: "Mile", factor: 1609.34 },
    },
  },
  weight: {
    name: "Weight",
    units: {
      kilogram: { name: "Kilogram", factor: 1 },
      gram: { name: "Gram", factor: 0.001 },
      pound: { name: "Pound", factor: 0.453592 },
      ounce: { name: "Ounce", factor: 0.0283495 },
      ton: { name: "Ton", factor: 1000 },
      stone: { name: "Stone", factor: 6.35029 },
    },
  },
  temperature: {
    name: "Temperature",
    units: {
      celsius: { name: "Celsius", factor: 1 },
      fahrenheit: { name: "Fahrenheit", factor: 1 },
      kelvin: { name: "Kelvin", factor: 1 },
    },
  },
  area: {
    name: "Area",
    units: {
      "square-meter": { name: "Square Meter", factor: 1 },
      "square-kilometer": { name: "Square Kilometer", factor: 1000000 },
      "square-centimeter": { name: "Square Centimeter", factor: 0.0001 },
      "square-inch": { name: "Square Inch", factor: 0.00064516 },
      "square-foot": { name: "Square Foot", factor: 0.092903 },
      acre: { name: "Acre", factor: 4046.86 },
      hectare: { name: "Hectare", factor: 10000 },
    },
  },
  volume: {
    name: "Volume",
    units: {
      liter: { name: "Liter", factor: 1 },
      milliliter: { name: "Milliliter", factor: 0.001 },
      gallon: { name: "Gallon (US)", factor: 3.78541 },
      quart: { name: "Quart", factor: 0.946353 },
      pint: { name: "Pint", factor: 0.473176 },
      cup: { name: "Cup", factor: 0.236588 },
      "fluid-ounce": { name: "Fluid Ounce", factor: 0.0295735 },
    },
  },
}

export default function UnitConverter() {
  const [category, setCategory] = useState("length")
  const [fromUnit, setFromUnit] = useState("meter")
  const [toUnit, setToUnit] = useState("kilometer")
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")

  const convertValue = (value: string, from: string, to: string, cat: string) => {
    if (!value || isNaN(Number(value))) return ""

    const numValue = Number(value)

    if (cat === "temperature") {
      return convertTemperature(numValue, from, to).toString()
    }

    const fromFactor =
      unitCategories[cat as keyof typeof unitCategories].units[
        from as keyof (typeof unitCategories)[keyof typeof unitCategories]["units"]
      ].factor
    const toFactor =
      unitCategories[cat as keyof typeof unitCategories].units[
        to as keyof (typeof unitCategories)[keyof typeof unitCategories]["units"]
      ].factor

    const result = (numValue * fromFactor) / toFactor
    return result.toString()
  }

  const convertTemperature = (value: number, from: string, to: string) => {
    let celsius = value

    // Convert to Celsius first
    if (from === "fahrenheit") {
      celsius = ((value - 32) * 5) / 9
    } else if (from === "kelvin") {
      celsius = value - 273.15
    }

    // Convert from Celsius to target
    if (to === "fahrenheit") {
      return (celsius * 9) / 5 + 32
    } else if (to === "kelvin") {
      return celsius + 273.15
    }

    return celsius
  }

  useEffect(() => {
    if (fromValue) {
      const result = convertValue(fromValue, fromUnit, toUnit, category)
      setToValue(result)
    }
  }, [fromValue, fromUnit, toUnit, category])

  const handleSwapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
    setToValue(fromValue)
  }

  const currentUnits = unitCategories[category as keyof typeof unitCategories].units

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(unitCategories).map(([key, cat]) => (
                <SelectItem key={key} value={key}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>From</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currentUnits).map(([key, unit]) => (
                  <SelectItem key={key} value={key}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Enter value"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currentUnits).map(([key, unit]) => (
                  <SelectItem key={key} value={key}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Result"
              value={toValue}
              readOnly
              className="bg-gray-50 dark:bg-gray-800"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleSwapUnits} variant="outline" size="lg">
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Swap Units
        </Button>
      </div>
    </div>
  )
}
