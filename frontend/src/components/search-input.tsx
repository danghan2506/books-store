import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import React, { useCallback, useRef } from "react"
interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
  isLoading?: boolean
  className?: string
}
export const SearchInput = ({ 
  value, 
  onChange, 
  onClear, 
  placeholder = "Search...", 
  isLoading = false,
  className 
}: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }, [onChange])
    const handleClear = useCallback(() => {
        onClear()
        setTimeout(() => inputRef.current?.focus(), 0)
    }, [onClear])
  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="pl-10 pr-10 transition-smooth focus:ring-2 focus:ring-primary/20"
          disabled={isLoading}
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted"
            disabled={isLoading}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {isLoading && (
        <div className="ml-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
}