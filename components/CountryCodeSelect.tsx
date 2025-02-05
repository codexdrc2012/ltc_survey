import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const countries = [
  { code: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+237", name: "Cameroun", flag: "🇨🇲" },
  { code: "+225", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "+212", name: "Maroc", flag: "🇲🇦" },
  { code: "+213", name: "Algérie", flag: "🇩🇿" },
  { code: "+509", name: "Haïti", flag: "🇭🇹" },
  { code: "+243", name: "RD Congo", flag: "🇨🇩" },
  { code: "+242", name: "Congo", flag: "🇨🇬" },
  { code: "+91", name: "Inde", flag: "🇮🇳" },
  { code: "+32", name: "Belgique", flag: "🇧🇪" },
  { code: "+41", name: "Suisse", flag: "🇨🇭" },
  { code: "+221", name: "Sénégal", flag: "🇸🇳" },
  { code: "+216", name: "Tunisie", flag: "🇹🇳" },
]

interface CountryCodeSelectProps {
  onValueChange: (value: string) => void
  value: string
}

export function CountryCodeSelect({ onValueChange, value }: CountryCodeSelectProps) {
  return (
    <Select onValueChange={onValueChange} value={value || "+1"}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Indicatif" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={`${country.code}-${country.name}`} value={country.code}>
            <span className="flex items-center">
              <span className="mr-2">{country.flag}</span>
              <span>
                {country.name} ({country.code})
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

