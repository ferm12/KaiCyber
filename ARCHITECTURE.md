# Architecture Documentation

## Overview

The KaiCyber Security Vulnerability Dashboard is a modern React application built with TypeScript, designed to efficiently handle and visualize large-scale security vulnerability data (300MB+ JSON files).

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Client                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  Redux Store │  │   Utilities  │      │
│  │  Components  │◄─┤   (State)    │◄─┤  (Processing)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                    ┌───────┴────────┐
                    │  Static Assets │
                    │  (ui_demo.json)│
                    └────────────────┘
```

## Component Architecture

### Component Hierarchy

```
App (Root)
├── Layout
│   ├── AppBar (Header)
│   └── Navigation (Sidebar)
│       └── Menu Items
└── Main Content (Routes)
    ├── Dashboard (/dashboard)
    │   ├── Filter Status Banner
    │   ├── Action Buttons (Analysis, AI Analysis)
    │   ├── Metrics Cards (4 cards)
    │   └── Chart Grid
    │       ├── SeverityChart
    │       ├── CvssDistributionChart
    │       ├── RiskFactorsChart
    │       ├── AiVsManualChart
    │       └── TrendChart
    │
    ├── VulnerabilityList (/vulnerabilities)
    │   ├── Filter Panel
    │   │   ├── Search Input
    │   │   ├── CVE Filter
    │   │   ├── Package Filter
    │   │   ├── Severity Multi-Select
    │   │   └── CVSS Range
    │   ├── Results Count
    │   └── Data Table
    │       ├── Sortable Headers
    │       ├── Pagination
    │       └── Row Actions
    │
    ├── VulnerabilityDetail (/vulnerabilities/:id)
    │   ├── Header with CVE
    │   ├── Info Cards Grid
    │   │   ├── Package Info
    │   │   ├── Status & Dates
    │   │   ├── Description
    │   │   ├── Risk Factors
    │   │   ├── Deployment Info
    │   │   └── External Links
    │   └── Back Button
    │
    └── Comparison (/comparison)
        ├── Selection Autocomplete
        └── Comparison View
            ├── Side-by-side Cards
            └── Comparison Table
```

## State Management Architecture

### Redux Store Structure

```
store/
├── vulnerabilitiesSlice
│   ├── rawData: VulnerabilityData | null
│   ├── processedVulnerabilities: ProcessedVulnerability[]
│   ├── filteredVulnerabilities: ProcessedVulnerability[]
│   ├── metrics: DashboardMetrics | null
│   ├── loading: boolean
│   ├── error: string | null
│   └── lastUpdated: number | null
│
├── filtersSlice
│   ├── searchQuery: string
│   ├── severity: Severity[]
│   ├── kaiStatus: KaiStatus[]
│   ├── packageName: string
│   ├── cve: string
│   ├── minCvss: number
│   ├── maxCvss: number
│   ├── dateRange: { start: Date | null, end: Date | null }
│   ├── excludeInvalidNorisk: boolean
│   └── excludeAiInvalidNorisk: boolean
│
└── uiSlice
    ├── selectedVulnerabilities: string[]
    ├── comparisonMode: boolean
    ├── sidebarOpen: boolean
    ├── theme: 'light' | 'dark'
    ├── itemsPerPage: number
    ├── sortBy: { field: string, direction: 'asc' | 'desc' }
    └── viewMode: 'grid' | 'list'
```

### Data Flow

1. **Initial Load**:
   ```
   App Component
   → dispatch(loadVulnerabilityData('/ui_demo.json'))
   → Async Thunk fetches JSON
   → processVulnerabilityData() transforms data
   → Redux state updated
   → Components re-render with data
   ```

2. **Filtering Flow**:
   ```
   User Action (Filter Change)
   → Filter Action dispatched
   → Filter state updated in Redux
   → useEffect in component detects change
   → applyFilters() processes vulnerabilities
   → Filtered results stored in Redux
   → Metrics recalculated
   → Components re-render
   ```

3. **Chart Data Flow**:
   ```
   Component subscribes to filteredVulnerabilities
   → useMemo hook processes chart data
   → Chart component receives data
   → Chart.js renders visualization
   ```

## Data Processing Pipeline

### Data Transformation

```
Raw JSON (Nested Structure)
    ↓
processVulnerabilityData()
    ↓
Flatten to Array
    ↓
Enrich with Metadata
    ├── Generate unique IDs
    ├── Parse dates (to ISO strings for Redux)
    ├── Add context (group, repo, image)
    └── Preserve all original fields
    ↓
ProcessedVulnerability[]
    ↓
Store in Redux
```

### Filtering Pipeline

```
ProcessedVulnerabilities[]
    ↓
applyFilters()
    ├── Filter by kaiStatus exclusions (most selective first)
    ├── Filter by kaiStatus inclusions
    ├── Filter by severity
    ├── Filter by CVSS range
    ├── Filter by package name
    ├── Filter by CVE
    ├── Filter by date range
    └── Filter by search query
    ↓
FilteredVulnerabilities[]
    ↓
sortVulnerabilities()
    ↓
Sorted & Filtered Results
```

## Performance Optimizations

### 1. Code Splitting
- **Route-based splitting**: Each page component lazy-loaded
- **Reduces initial bundle size**: Only loads code when needed
- **Implementation**: `React.lazy()` with `Suspense` boundaries

### 2. Memoization
- **Chart data**: `useMemo` prevents recalculation on every render
- **Filtered results**: Computed once per filter change
- **Component memoization**: Ready for `React.memo()` if needed

### 3. Efficient Filtering
- **Early exits**: Most selective filters applied first
- **Single pass**: All filters applied in one iteration
- **Indexed lookups**: Ready for index-based filtering if needed

### 4. Pagination
- **Client-side pagination**: Reduces DOM nodes
- **Configurable page size**: 25, 50, 100, 200 items
- **Virtual scrolling**: Ready for `react-window` integration

### 5. Large File Handling
- **Streaming fetch**: Browser handles large files efficiently
- **Progressive processing**: Data processed as it loads
- **Memory management**: Processed data replaces raw data

## Component Patterns

### Functional Components with Hooks
- All components use functional syntax
- Custom hooks for shared logic (ready for extraction)
- Hooks for state management: `useAppSelector`, `useAppDispatch`

### Container/Presentational Pattern
- **Containers**: Pages (Dashboard, VulnerabilityList) - handle logic
- **Presentational**: Charts, Cards - display data
- Clear separation of concerns

### Composition Pattern
- Small, reusable components
- Props-based communication
- Easy to test and maintain

## Type Safety

### TypeScript Usage
- **Strict mode**: Enabled for maximum type safety
- **Interface definitions**: All data structures typed
- **Redux typing**: Typed hooks and actions
- **Component props**: All props typed

### Key Types
- `ProcessedVulnerability`: Core vulnerability type
- `VulnerabilityData`: Raw JSON structure
- `FilterState`: Filter configuration
- `DashboardMetrics`: Calculated metrics

## Error Handling

### Error Boundaries
- Ready for React Error Boundaries
- Error states in Redux
- User-friendly error messages

### Loading States
- Loading indicators during data fetch
- Skeleton screens (ready for implementation)
- Progress feedback for large operations

### Integration Tests
- Data loading flow
- Filter application
- Navigation flow

### E2E Tests
- User workflows
- Filter interactions
- Export functionality

## Scalability Considerations

### Current Capacity
- Handles 300MB+ JSON files
- Processes 100K+ vulnerabilities
- Smooth UI with large datasets

### Future Enhancements
- **Server-side processing**: Move processing to backend
- **Database integration**: Store processed data
- **Caching**: Cache processed results
- **Web Workers**: Offload heavy processing
- **Incremental loading**: Load data in chunks

## Security Considerations

### Data Handling
- No sensitive data in client-side code
- XSS prevention: React's built-in escaping
- Safe JSON parsing: Type validation

### Best Practices
- Input validation
- Sanitized exports
- Secure external links (target="_blank" with rel="noopener")


### Features Used
- ES2020 JavaScript
- CSS Grid/Flexbox
- Fetch API
- Modern React features

## Build & Deployment

### Development
- Vite dev server with HMR
- Fast refresh for React components
- Source maps for debugging

### Production
- Optimized bundle with code splitting
- Minified assets
- Tree shaking for unused code
- Static asset optimization

### Implementation
- `publishedDate` and `fixDateParsed` stored as `string | null`
- `parseDateString()` utility converts ISO strings to Date objects
- Date comparisons work with ISO strings (lexicographic sorting)
