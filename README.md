# KaiCyber Security Vulnerability Dashboard

A comprehensive React-based dashboard application for visualizing and analyzing security vulnerabilities in a software ecosystem. Built with modern web technologies and optimized for handling large datasets (300MB+ JSON files). 
Demo: http://3.235.238.146

## Features

### Core Functionality
- **Large Data Handling**: Efficiently loads and processes large JSON files (300MB+)
- **Real-time Filtering**: Advanced filtering capabilities with multiple criteria
- **Interactive Visualizations**: Multiple chart types using Chart.js
- **Search & Discovery**: Real-time search with suggestions
- **Vulnerability Management**: Detailed views, comparison, and export functionality

### Key Features
-  **Analysis Filters**: 
  - "Analysis" button filters out CVEs with `kaiStatus: "invalid - norisk"`
  - "AI Analysis" button filters out CVEs with `kaiStatus: "ai-invalid-norisk"`
-  **Data Visualization**:
  - Severity distribution (Doughnut chart)
  - Risk factors frequency (Bar chart)
  - Vulnerability trends over time (Line chart)
  - CVSS score distribution (Bar chart)
  - AI vs Manual analysis comparison (Doughnut chart)
-  **Advanced Features**:
  - Vulnerability comparison tool
  - CSV/JSON export functionality
  - Pagination and virtualization for large datasets
  - Responsive design with Material UI

## ️ Technical Stack

- **Framework**: React 18.2 with TypeScript
- **Build Tool**: Vite 5.0
- **State Management**: Redux Toolkit
- **UI Library**: Material UI (MUI) 5.14
- **Charts**: Chart.js 4.4 with react-chartjs-2
- **Routing**: React Router 6.20
- **Code Splitting**: React.lazy() for optimized bundle sizes

##  Installation

### Prerequisites
- Node.js 18+ and npm/yarn

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Place Data File**
   Ensure `https://github.com/chanduusc/Ui-Demo-Data/blob/main/ui_demo.json` file is in the `public` directory (or root directory for Vite to serve it)

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

##  Project Structure

```
KaiCyber/
├── public/
│   └── ui_demo.json          # Large vulnerability data file
├── src/
│   ├── components/
│   │   ├── Charts/           # Chart components (Chart.js)
│   │   ├── Dashboard/        # Dashboard-specific components
│   │   └── Layout/           # Layout and navigation components
│   ├── pages/
│   │   ├── Dashboard.tsx     # Main dashboard view
│   │   ├── VulnerabilityList.tsx
│   │   ├── VulnerabilityDetail.tsx
│   │   └── Comparison.tsx
│   ├── store/
│   │   ├── slices/           # Redux slices
│   │   │   ├── vulnerabilitiesSlice.ts
│   │   │   ├── filtersSlice.ts
│   │   │   └── uiSlice.ts
│   │   ├── hooks.ts          # Typed Redux hooks
│   │   └── index.ts          # Store configuration
│   ├── types/
│   │   └── vulnerability.ts  # TypeScript type definitions
│   ├── utils/
│   │   ├── dataProcessor.ts  # Data loading and processing
│   │   ├── filterUtils.ts    # Filtering logic
│   │   ├── chartUtils.ts     # Chart data preparation
│   │   └── exportUtils.ts    # CSV/JSON export
│   ├── App.tsx               # Main app component with routing
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ️ Architecture

### Component Hierarchy

```
App
├── Layout
│   ├── Navigation (Sidebar)
│   └── Main Content Area
│       ├── Dashboard (Route: /dashboard)
│       │   ├── Metrics Cards
│       │   ├── Analysis Buttons
│       │   └── Chart Components
│       ├── VulnerabilityList (Route: /vulnerabilities)
│       │   ├── Filter Panel
│       │   └── Data Table (Virtualized)
│       ├── VulnerabilityDetail (Route: /vulnerabilities/:id)
│       └── Comparison (Route: /comparison)
```

### State Management

The application uses Redux Toolkit with three main slices:

1. **vulnerabilitiesSlice**: Manages raw and processed vulnerability data
2. **filtersSlice**: Handles all filter states and filter actions
3. **uiSlice**: Manages UI state (selections, sorting, pagination, theme)

### Data Flow

1. **Data Loading**: 
   - `loadVulnerabilityData` async thunk loads JSON from `/ui_demo.json`
   - Data is processed into flat array structure for efficient querying
   - Index maps created for fast lookups

2. **Filtering**:
   - Filters applied via `applyFilters` utility
   - Results stored in Redux state
   - Metrics recalculated on filter changes

3. **Rendering**:
   - Components subscribe to filtered data via Redux hooks
   - Charts use memoized data preparation
   - Virtualization used for large lists

##  Key Components

### Dashboard
- **Metrics Cards**: Display key statistics (total, critical, high, average CVSS)
- **Analysis Buttons**: 
  - "Analysis" - Excludes `invalid - norisk` CVEs
  - "AI Analysis" - Excludes `ai-invalid-norisk` CVEs
- **Charts**: Multiple visualizations showing different aspects of the data

### Vulnerability List
- **Advanced Filters**: Search, CVE, package name, severity, CVSS range
- **Sortable Table**: Sort by CVE, severity, CVSS, package name
- **Pagination**: Configurable items per page (25, 50, 100, 200)
- **Export**: Download filtered results as CSV

### Vulnerability Detail
- Comprehensive view of individual vulnerability
- All metadata displayed in organized cards
- Links to external resources (NVD)

### Comparison
- Side-by-side comparison of up to 5 vulnerabilities
- Comparison table showing key fields
- Visual cards for quick overview

##  Data Processing

### Data Structure
The application expects JSON data in the following structure:
```json
{
  "name": "default",
  "groups": {
    "group-name": {
      "name": "group-name",
      "repos": {
        "repo-name": {
          "name": "repo-name",
          "images": {
            "version": {
              "name": "image-name",
              "vulnerabilities": [
                {
                  "cve": "CVE-2024-XXXXX",
                  "severity": "high",
                  "cvss": 8.1,
                  "kaiStatus": "invalid - norisk",
                  ...
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

### Processing Pipeline
1. **Flattening**: Nested structure converted to flat array
2. **Enrichment**: Additional fields added (id, dates parsed, context)
3. **Indexing**: Maps created for fast lookups by CVE, package, severity, etc.
4. **Filtering**: Efficient filtering with early exits for performance

##  Performance Optimizations

1. **Code Splitting**: Routes lazy-loaded with React.lazy()
2. **Memoization**: 
   - Chart data preparation memoized with useMemo
   - Components memoized where appropriate
3. **Efficient Filtering**: 
   - Most selective filters applied first
   - Early exits in filter chain
4. **Pagination**: Large datasets paginated to reduce DOM nodes
5. **Virtualization**: Ready for react-window integration for very large lists

##  Filtering Logic

### KaiStatus Filtering
- **"invalid - norisk"**: Filtered when "Analysis" button clicked
- **"ai-invalid-norisk"**: Filtered when "AI Analysis" button clicked
- Both filters can be active simultaneously
- Visual indicators show active filter state

### Other Filters
- **Search**: Searches across CVE, package name, description, severity, group, repo
- **Severity**: Multi-select filter
- **CVSS Range**: Min/max slider or input
- **Date Range**: Published date filtering
- **Package/CVE**: Exact or partial match

##  Charts

All charts are interactive and update based on filtered data:

1. **Severity Distribution**: Doughnut chart showing count by severity
2. **CVSS Distribution**: Bar chart showing score ranges
3. **Risk Factors**: Horizontal bar chart of top 10 risk factors
4. **Trends**: Line chart showing vulnerabilities over time
5. **AI vs Manual**: Doughnut chart comparing analysis types

##  Usage

### Basic Workflow

1. **View Dashboard**: 
   - See overall metrics and visualizations
   - Click "Analysis" or "AI Analysis" to filter data

2. **Browse Vulnerabilities**:
   - Navigate to Vulnerabilities page
   - Use filters to narrow down results
   - Click on a vulnerability to see details

3. **Compare Vulnerabilities**:
   - Go to Comparison page
   - Search and select up to 5 vulnerabilities
   - View side-by-side comparison

4. **Export Data**:
   - Apply desired filters
   - Click "Export CSV" button
   - Download filtered results

##  Troubleshooting

### Large File Loading
- If the JSON file is very large (>500MB), consider:
  - Using server-side processing
  - Implementing streaming/chunked loading
  - Pre-processing data into smaller chunks

### Performance Issues
- Reduce items per page in table
- Use more specific filters to reduce dataset size
- Check browser console for memory warnings

---
