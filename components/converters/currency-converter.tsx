"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const currencies = {
  USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  EUR: { name: "Euro", symbol: "€", flag: "🇪🇺" },
  GBP: { name: "British Pound", symbol: "£", flag: "🇬🇧" },
  JPY: { name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  AUD: { name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  CAD: { name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  CHF: { name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  CNY: { name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  INR: { name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  KRW: { name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  BRL: { name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  RUB: { name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
}

// Mock exchange rates (in a real app, you'd fetch from an API)
const mockRates = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110,
  AUD: 1.35,
  CAD: 1.25,
  CHF: 0.92,
  CNY: 6.45,
  INR: 74.5,
  KRW: 1180,
  BRL: 5.2,
  RUB: 75,
}

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [exchangeRate, setExchangeRate] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const convertCurrency = (amount: string, from: string, to: string) => {
    if (!amount || isNaN(Number(amount))) return ""

    const numAmount = Number(amount)
    const fromRate = mockRates[from as keyof typeof mockRates]
    const toRate = mockRates[to as keyof typeof mockRates]

    const usdAmount = numAmount / fromRate
    const result = usdAmount * toRate

    return result.toFixed(2)
  }

  useEffect(() => {
    if (fromAmount) {
      const result = convertCurrency(fromAmount, fromCurrency, toCurrency)
      setToAmount(result)
    }

    // Calculate exchange rate
    const fromRate = mockRates[fromCurrency as keyof typeof mockRates]
    const toRate = mockRates[toCurrency as keyof typeof mockRates]
    const rate = toRate / fromRate
    setExchangeRate(rate)
  }, [fromAmount, fromCurrency, toCurrency])

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Currency Exchange</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Live Rates
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>From</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currencies).map(([code, currency]) => (
                  <SelectItem key={code} value={code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span>{code}</span>
                      <span className="text-gray-500">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Enter amount"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currencies).map(([code, currency]) => (
                  <SelectItem key={code} value={code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span>{code}</span>
                      <span className="text-gray-500">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Converted amount"
              value={toAmount}
              readOnly
              className="bg-gray-50 dark:bg-gray-800"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Button onClick={handleSwapCurrencies} variant="outline" size="lg">
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Swap Currencies
        </Button>

        {exchangeRate > 0 && (
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Exchange Rate</div>
              <div className="text-lg font-semibold">
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
