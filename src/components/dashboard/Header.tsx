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
            <Select value={filters.injuryGroupCode} onValueChange={(v) => onFilterChange('injuryGroupCode', v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Injury Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Injury Groups</SelectItem>
                <SelectItem value="SSNB">SSNB - Sprain/Strain, Neck/Back</SelectItem>
                <SelectItem value="MCHI">MCHI - Minor Closed Head Injury</SelectItem>
                <SelectItem value="BULG">BULG - Bulge/Herniation</SelectItem>
                <SelectItem value="DINB">DINB - Disc Injury, Neck/Back</SelectItem>
                <SelectItem value="MSUE">MSUE - Muscle/Soft Tissue</SelectItem>
                <SelectItem value="JFLE">JFLE - Joint/Flex/Limb</SelectItem>
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

            <Select value={filters.severityScore} onValueChange={(v) => onFilterChange('severityScore', v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low (1-4)</SelectItem>
                <SelectItem value="medium">Medium (4-8)</SelectItem>
                <SelectItem value="high">High (8+)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.cautionLevel} onValueChange={(v) => onFilterChange('cautionLevel', v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Caution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Caution Levels</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.venueRating} onValueChange={(v) => onFilterChange('venueRating', v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Conservative">Conservative</SelectItem>
                <SelectItem value="Liberal">Liberal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.impact} onValueChange={(v) => onFilterChange('impact', v)}>
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
