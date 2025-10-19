import { FilterState } from "@/types/claims";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  filters: FilterState;
  counties: string[];
  onFilterChange: (key: keyof FilterState, value: string) => void;
}

export function Header({ filters, counties, onFilterChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-md backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ClaimIQ Analytics
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Consensus-Driven Claims Intelligence Platform
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={filters.injuryGroup} onValueChange={(v) => onFilterChange('injuryGroup', v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Injury Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Injury Groups</SelectItem>
                <SelectItem value="Group_NB">Neck & Back</SelectItem>
                <SelectItem value="Group_JFL">Joint/Flex/Limb</SelectItem>
                <SelectItem value="Group_SSU">Soft Tissue</SelectItem>
                <SelectItem value="Group_LEG">Leg</SelectItem>
                <SelectItem value="Group_HEAD">Head</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.county} onValueChange={(v) => onFilterChange('county', v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="County" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {counties.map(county => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.severity} onValueChange={(v) => onFilterChange('severity', v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low (1-5)</SelectItem>
                <SelectItem value="medium">Medium (6-10)</SelectItem>
                <SelectItem value="high">High (11-15)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.caution} onValueChange={(v) => onFilterChange('caution', v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Caution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Caution</SelectItem>
                <SelectItem value="low">Low (0-3)</SelectItem>
                <SelectItem value="medium">Medium (4-7)</SelectItem>
                <SelectItem value="high">High (8-10)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.venueRating} onValueChange={(v) => onFilterChange('venueRating', v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="liberal">Liberal</SelectItem>
                <SelectItem value="extreme">Extreme</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.impactLife} onValueChange={(v) => onFilterChange('impactLife', v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impact</SelectItem>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.year} onValueChange={(v) => onFilterChange('year', v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}
