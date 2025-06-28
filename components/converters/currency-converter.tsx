"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

const currencies = {
  // Major Currencies
  USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸", region: "North America" },
  EUR: { name: "Euro", symbol: "€", flag: "🇪🇺", region: "Europe" },
  GBP: { name: "British Pound", symbol: "£", flag: "🇬🇧", region: "Europe" },
  JPY: { name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", region: "Asia" },

  // North America
  CAD: { name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", region: "North America" },
  MXN: { name: "Mexican Peso", symbol: "$", flag: "🇲🇽", region: "North America" },

  // Europe
  CHF: { name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭", region: "Europe" },
  NOK: { name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴", region: "Europe" },
  SEK: { name: "Swedish Krona", symbol: "kr", flag: "🇸🇪", region: "Europe" },
  DKK: { name: "Danish Krone", symbol: "kr", flag: "🇩🇰", region: "Europe" },
  PLN: { name: "Polish Zloty", symbol: "zł", flag: "🇵🇱", region: "Europe" },
  CZK: { name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿", region: "Europe" },
  HUF: { name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺", region: "Europe" },
  RON: { name: "Romanian Leu", symbol: "lei", flag: "🇷🇴", region: "Europe" },
  BGN: { name: "Bulgarian Lev", symbol: "лв", flag: "🇧🇬", region: "Europe" },
  HRK: { name: "Croatian Kuna", symbol: "kn", flag: "🇭🇷", region: "Europe" },
  RSD: { name: "Serbian Dinar", symbol: "дин", flag: "🇷🇸", region: "Europe" },
  ISK: { name: "Icelandic Krona", symbol: "kr", flag: "🇮🇸", region: "Europe" },

  // Asia-Pacific
  CNY: { name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", region: "Asia" },
  INR: { name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", region: "Asia" },
  KRW: { name: "South Korean Won", symbol: "₩", flag: "🇰🇷", region: "Asia" },
  AUD: { name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", region: "Oceania" },
  NZD: { name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿", region: "Oceania" },
  SGD: { name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", region: "Asia" },
  HKD: { name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰", region: "Asia" },
  TWD: { name: "Taiwan Dollar", symbol: "NT$", flag: "🇹🇼", region: "Asia" },
  THB: { name: "Thai Baht", symbol: "฿", flag: "🇹🇭", region: "Asia" },
  MYR: { name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾", region: "Asia" },
  IDR: { name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩", region: "Asia" },
  PHP: { name: "Philippine Peso", symbol: "₱", flag: "🇵🇭", region: "Asia" },
  VND: { name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳", region: "Asia" },
  PKR: { name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰", region: "Asia" },
  BDT: { name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩", region: "Asia" },
  LKR: { name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰", region: "Asia" },
  NPR: { name: "Nepalese Rupee", symbol: "Rs", flag: "🇳🇵", region: "Asia" },
  MMK: { name: "Myanmar Kyat", symbol: "K", flag: "🇲🇲", region: "Asia" },
  KHR: { name: "Cambodian Riel", symbol: "៛", flag: "🇰🇭", region: "Asia" },
  LAK: { name: "Lao Kip", symbol: "₭", flag: "🇱🇦", region: "Asia" },

  // Middle East
  AED: { name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪", region: "Middle East" },
  SAR: { name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦", region: "Middle East" },
  QAR: { name: "Qatari Riyal", symbol: "﷼", flag: "🇶🇦", region: "Middle East" },
  KWD: { name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼", region: "Middle East" },
  BHD: { name: "Bahraini Dinar", symbol: ".د.ب", flag: "🇧🇭", region: "Middle East" },
  OMR: { name: "Omani Rial", symbol: "﷼", flag: "🇴🇲", region: "Middle East" },
  JOD: { name: "Jordanian Dinar", symbol: "د.ا", flag: "🇯🇴", region: "Middle East" },
  LBP: { name: "Lebanese Pound", symbol: "ل.ل", flag: "🇱🇧", region: "Middle East" },
  ILS: { name: "Israeli Shekel", symbol: "₪", flag: "🇮🇱", region: "Middle East" },
  IRR: { name: "Iranian Rial", symbol: "﷼", flag: "🇮🇷", region: "Middle East" },
  IQD: { name: "Iraqi Dinar", symbol: "ع.د", flag: "🇮🇶", region: "Middle East" },
  TRY: { name: "Turkish Lira", symbol: "₺", flag: "🇹🇷", region: "Middle East" },

  // Africa
  ZAR: { name: "South African Rand", symbol: "R", flag: "🇿🇦", region: "Africa" },
  EGP: { name: "Egyptian Pound", symbol: "£", flag: "🇪🇬", region: "Africa" },
  NGN: { name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬", region: "Africa" },
  KES: { name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪", region: "Africa" },
  GHS: { name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭", region: "Africa" },
  MAD: { name: "Moroccan Dirham", symbol: "د.م.", flag: "🇲🇦", region: "Africa" },
  TND: { name: "Tunisian Dinar", symbol: "د.ت", flag: "🇹🇳", region: "Africa" },
  ETB: { name: "Ethiopian Birr", symbol: "Br", flag: "🇪🇹", region: "Africa" },
  UGX: { name: "Ugandan Shilling", symbol: "USh", flag: "🇺🇬", region: "Africa" },
  TZS: { name: "Tanzanian Shilling", symbol: "TSh", flag: "🇹🇿", region: "Africa" },
  ZMW: { name: "Zambian Kwacha", symbol: "ZK", flag: "🇿🇲", region: "Africa" },
  BWP: { name: "Botswana Pula", symbol: "P", flag: "🇧🇼", region: "Africa" },
  MUR: { name: "Mauritian Rupee", symbol: "₨", flag: "🇲🇺", region: "Africa" },

  // South America
  BRL: { name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", region: "South America" },
  ARS: { name: "Argentine Peso", symbol: "$", flag: "🇦🇷", region: "South America" },
  CLP: { name: "Chilean Peso", symbol: "$", flag: "🇨🇱", region: "South America" },
  COP: { name: "Colombian Peso", symbol: "$", flag: "🇨🇴", region: "South America" },
  PEN: { name: "Peruvian Sol", symbol: "S/", flag: "🇵🇪", region: "South America" },
  UYU: { name: "Uruguayan Peso", symbol: "$U", flag: "🇺🇾", region: "South America" },
  PYG: { name: "Paraguayan Guarani", symbol: "₲", flag: "🇵🇾", region: "South America" },
  BOB: { name: "Bolivian Boliviano", symbol: "Bs", flag: "🇧🇴", region: "South America" },
  VES: { name: "Venezuelan Bolívar", symbol: "Bs.S", flag: "🇻🇪", region: "South America" },
  GYD: { name: "Guyanese Dollar", symbol: "$", flag: "🇬🇾", region: "South America" },
  SRD: { name: "Surinamese Dollar", symbol: "$", flag: "🇸🇷", region: "South America" },

  // Eastern Europe & Russia
  RUB: { name: "Russian Ruble", symbol: "₽", flag: "🇷🇺", region: "Europe" },
  UAH: { name: "Ukrainian Hryvnia", symbol: "₴", flag: "🇺🇦", region: "Europe" },
  BYN: { name: "Belarusian Ruble", symbol: "Br", flag: "🇧🇾", region: "Europe" },
  MDL: { name: "Moldovan Leu", symbol: "L", flag: "🇲🇩", region: "Europe" },
  GEL: { name: "Georgian Lari", symbol: "₾", flag: "🇬🇪", region: "Europe" },
  AMD: { name: "Armenian Dram", symbol: "֏", flag: "🇦🇲", region: "Europe" },
  AZN: { name: "Azerbaijani Manat", symbol: "₼", flag: "🇦🇿", region: "Europe" },

  // Central Asia
  KZT: { name: "Kazakhstani Tenge", symbol: "₸", flag: "🇰🇿", region: "Asia" },
  UZS: { name: "Uzbekistani Som", symbol: "so'm", flag: "🇺🇿", region: "Asia" },
  KGS: { name: "Kyrgyzstani Som", symbol: "с", flag: "🇰🇬", region: "Asia" },
  TJS: { name: "Tajikistani Somoni", symbol: "ЅМ", flag: "🇹🇯", region: "Asia" },
  TMT: { name: "Turkmenistani Manat", symbol: "m", flag: "🇹🇲", region: "Asia" },
  AFN: { name: "Afghan Afghani", symbol: "؋", flag: "🇦🇫", region: "Asia" },

  // Caribbean
  JMD: { name: "Jamaican Dollar", symbol: "J$", flag: "🇯🇲", region: "Caribbean" },
  TTD: { name: "Trinidad & Tobago Dollar", symbol: "TT$", flag: "🇹🇹", region: "Caribbean" },
  BBD: { name: "Barbadian Dollar", symbol: "Bds$", flag: "🇧🇧", region: "Caribbean" },
  XCD: { name: "East Caribbean Dollar", symbol: "EC$", flag: "🏴", region: "Caribbean" },

  // Pacific
  FJD: { name: "Fijian Dollar", symbol: "FJ$", flag: "🇫🇯", region: "Oceania" },
  TOP: { name: "Tongan Paʻanga", symbol: "T$", flag: "🇹🇴", region: "Oceania" },
  WST: { name: "Samoan Tala", symbol: "WS$", flag: "🇼🇸", region: "Oceania" },

  // Cryptocurrencies
  BTC: { name: "Bitcoin", symbol: "₿", flag: "₿", region: "Crypto" },
  ETH: { name: "Ethereum", symbol: "Ξ", flag: "Ξ", region: "Crypto" },

  // Special Drawing Rights
  XDR: { name: "Special Drawing Rights", symbol: "SDR", flag: "🏛️", region: "International" },
}

// Updated mock exchange rates with more realistic values
const mockRates = {
  // Major Currencies
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,

  // North America
  CAD: 1.25,
  MXN: 20.5,

  // Europe
  CHF: 0.92,
  NOK: 8.5,
  SEK: 9.2,
  DKK: 6.3,
  PLN: 3.9,
  CZK: 21.5,
  HUF: 295.0,
  RON: 4.15,
  BGN: 1.66,
  HRK: 6.4,
  RSD: 105.0,
  ISK: 125.0,

  // Asia-Pacific
  CNY: 6.45,
  INR: 74.5,
  KRW: 1180.0,
  AUD: 1.35,
  NZD: 1.42,
  SGD: 1.32,
  HKD: 7.8,
  TWD: 28.0,
  THB: 31.5,
  MYR: 4.15,
  IDR: 14250.0,
  PHP: 50.5,
  VND: 23000.0,
  PKR: 155.0,
  BDT: 85.0,
  LKR: 180.0,
  NPR: 119.0,
  MMK: 1400.0,
  KHR: 4050.0,
  LAK: 9500.0,

  // Middle East
  AED: 3.67,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.3,
  BHD: 0.377,
  OMR: 0.385,
  JOD: 0.709,
  LBP: 1500.0,
  ILS: 3.2,
  IRR: 42000.0,
  IQD: 1460.0,
  TRY: 8.5,

  // Africa
  ZAR: 14.5,
  EGP: 15.7,
  NGN: 410.0,
  KES: 108.0,
  GHS: 6.1,
  MAD: 8.9,
  TND: 2.8,
  ETB: 43.5,
  UGX: 3550.0,
  TZS: 2320.0,
  ZMW: 16.5,
  BWP: 11.2,
  MUR: 42.5,

  // South America
  BRL: 5.2,
  ARS: 98.5,
  CLP: 750.0,
  COP: 3650.0,
  PEN: 3.65,
  UYU: 43.5,
  PYG: 6850.0,
  BOB: 6.9,
  VES: 4.18,
  GYD: 209.0,
  SRD: 14.2,

  // Eastern Europe & Russia
  RUB: 75.0,
  UAH: 27.5,
  BYN: 2.55,
  MDL: 17.8,
  GEL: 3.1,
  AMD: 520.0,
  AZN: 1.7,

  // Central Asia
  KZT: 425.0,
  UZS: 10650.0,
  KGS: 84.5,
  TJS: 11.3,
  TMT: 3.5,
  AFN: 79.5,

  // Caribbean
  JMD: 145.0,
  TTD: 6.75,
  BBD: 2.0,
  XCD: 2.7,

  // Pacific
  FJD: 2.1,
  TOP: 2.25,
  WST: 2.55,

  // Cryptocurrencies (highly volatile - example rates)
  BTC: 0.000025,
  ETH: 0.00035,

  // Special Drawing Rights
  XDR: 0.72,
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

  const [selectedRegion, setSelectedRegion] = useState("all")

  const regions = [
    "all",
    "North America",
    "Europe",
    "Asia",
    "Middle East",
    "Africa",
    "South America",
    "Oceania",
    "Caribbean",
    "Crypto",
    "International",
  ]

  const getFilteredCurrencies = () => {
    if (selectedRegion === "all") {
      return Object.entries(currencies)
    }
    return Object.entries(currencies).filter(([_, currency]) => currency.region === selectedRegion)
  }

  const filteredCurrencies = getFilteredCurrencies()

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
            <div className="space-y-2">
              <Label>Region Filter</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region === "all" ? "All Regions" : region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {filteredCurrencies.map(([code, currency]) => (
                  <SelectItem key={code} value={code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span className="font-medium">{code}</span>
                      <span className="text-gray-500">- {currency.name}</span>
                      <span className="text-xs text-gray-400">({currency.region})</span>
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
            <div className="space-y-2">
              <Label>Region Filter</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region === "all" ? "All Regions" : region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {filteredCurrencies.map(([code, currency]) => (
                  <SelectItem key={code} value={code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span className="font-medium">{code}</span>
                      <span className="text-gray-500">- {currency.name}</span>
                      <span className="text-xs text-gray-400">({currency.region})</span>
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
