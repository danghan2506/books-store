import { BookOpen, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  type: "no-books" | "no-search-results"
  onReset?: () => void
  searchKeyword?: string
}

export const EmptyState = ({ type, onReset, searchKeyword }: EmptyStateProps) => {
  if (type === "no-search-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
          <Search className="h-8 w-8 text-library-accent" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No books found
        </h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          We couldn't find any books matching "{searchKeyword}". Try adjusting your search terms.
        </p>
        {onReset && (
          <Button variant="outline" onClick={onReset}>
            Clear search
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
        <BookOpen className="h-8 w-8 text-library-accent" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No books available
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        There are no books in the library yet. Add some books to get started.
      </p>
    </div>
  )
}