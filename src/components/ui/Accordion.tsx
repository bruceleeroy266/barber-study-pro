import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpen?: string[]
  className?: string
}

/**
 * Accordion Component
 * 
 * Collapsible content sections with accessible keyboard navigation.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <Accordion
 *   items={[
 *     { id: '1', title: 'Section 1', content: <p>Content 1</p> },
 *     { id: '2', title: 'Section 2', content: <p>Content 2</p> },
 *   ]}
 * />
 * ```
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className,
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultOpen)

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      } else {
        return prev.includes(id) ? [] : [id]
      }
    })
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id)
        return (
          <div
            key={item.id}
            className="border border-graphite rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 text-left bg-charcoal hover:bg-graphite/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:ring-inset"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <span className="text-sm font-semibold text-white">{item.title}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-silver transition-transform',
                  isOpen && 'transform rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                className="p-4 bg-charcoal/50 border-t border-graphite"
                role="region"
                aria-labelledby={`accordion-button-${item.id}`}
              >
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
