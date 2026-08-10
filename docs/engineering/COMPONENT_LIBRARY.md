# Component Library Documentation

**Version:** 1.0  
**Date:** 2026-08-09  
**Status:** Production Ready

---

## Overview

The ASCYN PRO Component Library is a comprehensive collection of reusable, production-ready React components built on top of the approved design system (BL-001 through BL-004).

### Design Principles

- **Consistency:** All components use the approved design tokens
- **Accessibility:** WCAG AA compliant with keyboard navigation and ARIA support
- **Composability:** Components are designed to work together seamlessly
- **Reusability:** No one-off UI — everything is reusable
- **Type Safety:** Full TypeScript support with exported prop types

---

## Component Categories

### Base UI Components (`src/components/ui/`)

Fundamental building blocks for all interfaces.

#### Button

Versatile button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `fullWidth`: boolean (default: false)
- `loading`: boolean (default: false)

**Example:**
```tsx
<Button variant="primary" size="md" onClick={() => {}}>
  Click Me
</Button>
```

#### IconButton

Accessible icon-only button.

**Props:**
- `icon`: LucideIcon (required)
- `variant`: 'primary' | 'secondary' | 'ghost' | 'outline' (default: 'ghost')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `aria-label`: string (required)

**Example:**
```tsx
<IconButton icon={Plus} variant="primary" aria-label="Add item" onClick={() => {}} />
```

#### Card

Container component with multiple variants.

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'ghost' (default: 'default')
- `padding`: 'none' | 'sm' | 'md' | 'lg' (default: 'md')
- `hover`: boolean (default: false)

**Sub-components:**
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

**Example:**
```tsx
<Card variant="default" padding="md">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

#### Form Components

**Input, Textarea, Select, Checkbox, Radio**

All form components support:
- `label`: string
- `error`: string
- `helperText`: string

**Example:**
```tsx
<Input
  label="Email"
  type="email"
  error={errors.email}
  helperText="We'll never share your email"
/>
```

#### Switch

Toggle switch component.

**Props:**
- `label`: string
- `description`: string
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Example:**
```tsx
<Switch
  label="Enable notifications"
  description="Receive email updates"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```

#### Badge & Chip

Status indicators and tags.

**Badge Props:**
- `variant`: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold'
- `size`: 'sm' | 'md' | 'lg'

**Chip Props:**
- Same as Badge + `onRemove`: () => void

**Example:**
```tsx
<Badge variant="success">Active</Badge>
<Chip variant="warning" onRemove={() => {}}>At Risk</Chip>
```

#### AlertPanel

Alert messages with icons and actions.

**Props:**
- `title`: string (required)
- `description`: string
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `dismissible`: boolean
- `onDismiss`: () => void
- `action`: { label: string; onClick: () => void }

**Example:**
```tsx
<AlertPanel
  title="At-Risk Students"
  description="5 students need attention"
  variant="warning"
  action={{ label: "View", onClick: () => {} }}
/>
```

#### Toast

Temporary notification messages.

**Props:**
- `id`: string (required)
- `title`: string
- `description`: string
- `variant`: 'default' | 'success' | 'warning' | 'error' | 'info'
- `duration`: number (default: 5000)
- `onDismiss`: (id: string) => void

#### Tooltip

Contextual information on hover/focus.

**Props:**
- `content`: string (required)
- `position`: 'top' | 'bottom' | 'left' | 'right' (default: 'top')
- `delay`: number (default: 200)

**Example:**
```tsx
<Tooltip content="This is a tooltip">
  <button>Hover me</button>
</Tooltip>
```

#### Modal

Accessible modal dialog with focus trap.

**Props:**
- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string (required)
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'md')

#### Drawer

Slide-in panel from screen edge.

**Props:**
- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string
- `position`: 'left' | 'right' | 'top' | 'bottom' (default: 'right')
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'md')

#### Table

Accessible data table.

**Sub-components:**
- `TableHeader`
- `TableBody`
- `TableRow`
- `TableHead`
- `TableCell`

**Example:**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### EmptyState

Empty state placeholder.

**Props:**
- `title`: string (required)
- `description`: string
- `action`: EmptyStateAction | React.ReactNode
- `icon`: React.ReactNode | string

#### LoadingState

Loading skeletons for different content types.

**Props:**
- `variant`: 'card' | 'table' | 'list' | 'text'
- `count`: number (default: 1)

#### Accordion

Collapsible content sections.

**Props:**
- `items`: AccordionItem[] (required)
- `allowMultiple`: boolean (default: false)
- `defaultOpen`: string[] (default: [])

#### Navigation Components

**TopNav, SideNav, NavItem, Breadcrumbs, Tabs, Pagination**

See `Navigation.tsx` for full API documentation.

#### ProgressBar

Linear progress indicator.

**Props:**
- `value`: number (0-100)
- `variant`: 'default' | 'success' | 'warning' | 'error'
- `size`: 'sm' | 'md' | 'lg'
- `showLabel`: boolean

---

### Layout Components (`src/components/layout/`)

Components for page structure and layout.

#### PageHeader

Consistent page header.

**Props:**
- `title`: string (required)
- `description`: string
- `actions`: React.ReactNode
- `breadcrumbs`: React.ReactNode

#### SectionHeader

Consistent section header.

**Props:**
- `title`: string (required)
- `description`: string
- `actions`: React.ReactNode

#### Hero

Large promotional section.

**Props:**
- `title`: string (required)
- `subtitle`: string
- `description`: string
- `primaryAction`: { label: string; onClick: () => void }
- `secondaryAction`: { label: string; onClick: () => void }
- `image`: React.ReactNode

---

### Feature Components (`src/components/feature/`)

Specialized components for specific features.

#### FeatureCard

Feature/benefit display card.

**Props:**
- `icon`: LucideIcon (required)
- `title`: string (required)
- `description`: string (required)
- `action`: { label: string; onClick: () => void }
- `variant`: 'default' | 'highlighted'

#### AIMessage

AI chat message display.

**Props:**
- `role`: 'user' | 'assistant' | 'system' (required)
- `content`: string (required)
- `timestamp`: string
- `isLoading`: boolean

#### Flashcard

Interactive flashcard with flip animation.

**Props:**
- `front`: string (required)
- `back`: string (required)
- `hint`: string
- `isFlipped`: boolean
- `onFlip`: () => void
- `onCorrect`: () => void
- `onIncorrect`: () => void
- `showActions`: boolean

#### QuizQuestion

Quiz question with multiple choice options.

**Props:**
- `question`: string (required)
- `options`: QuizOption[] (required)
- `selectedOption`: string
- `correctOption`: string
- `showFeedback`: boolean
- `onSelect`: (optionId: string) => void
- `questionNumber`: number
- `totalQuestions`: number

#### ProgressRing

Circular progress indicator.

**Props:**
- `value`: number (0-100)
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `showLabel`: boolean
- `label`: string
- `variant`: 'default' | 'success' | 'warning' | 'error'

---

## Usage Guidelines

### Importing Components

```tsx
// Import from centralized index
import { Button, Card, Input, Badge } from '@/components'

// Or import from specific category
import { Button } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { FeatureCard } from '@/components/feature'
```

### Design Token Usage

All components use CSS custom properties from the design token system. Do not override with hard-coded values.

### Accessibility

All components meet WCAG AA standards:
- Keyboard navigation support
- ARIA attributes
- Focus visible states
- Sufficient color contrast
- Touch target sizes (44x44px minimum)

### Responsive Design

All components are responsive by default using Tailwind's mobile-first breakpoints.

---

## Migration Guide

### Replacing One-Off UI

**Before:**
```tsx
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click Me
</button>
```

**After:**
```tsx
<Button variant="primary">Click Me</Button>
```

### Consolidating Duplicate Components

Use the centralized components instead of creating local variants.

---

## Known Limitations

1. **Toast Container:** Toast component requires a container to manage multiple toasts (not included)
2. **Table Sorting:** Table component does not include built-in sorting (add as needed)
3. **Drawer Focus Trap:** Drawer does not include focus trap (Modal does)
4. **Flashcard Animation:** Flashcard flip animation requires custom CSS (see component file)

---

## Future Enhancements

- Toast container with queue management
- Table sorting and filtering
- Drawer focus trap
- Additional chart components
- Calendar/date picker components
- Rich text editor component

---

**Last Updated:** 2026-08-09  
**Maintained By:** ASCYN PRO Engineering Team
