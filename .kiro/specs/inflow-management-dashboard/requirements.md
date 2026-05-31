# Requirements Document

## Introduction

The Inflow Management Dashboard is a new feature for the KalpDev PG Management system that provides administrators with a centralized view of tenant inflow data. It syncs data from multiple queries (tenants, rent, visitors, sharing/referrals), stores daily reports for historical tracking, and presents key inflow metrics in an interactive dashboard. This enables the admin to monitor new tenant acquisition, track inquiry-to-move-in conversion, and make data-driven decisions about occupancy growth.

## Glossary

- **Dashboard**: The interactive admin page that displays inflow metrics, charts, and daily reports
- **Inflow**: The process of new tenants inquiring about, visiting, and moving into the PG
- **Daily_Report**: A snapshot of inflow metrics captured and stored for a specific date
- **Query_Source**: A data collection in Firebase from which inflow-related data is fetched (e.g., tenants, visitors, sharing)
- **Sync_Engine**: The component responsible for fetching and aggregating data from multiple query sources
- **Inflow_Pipeline**: The stages a prospective tenant passes through: Inquiry → Visit → Confirmation → Move-In
- **Conversion_Rate**: The percentage of inquiries or visits that result in confirmed move-ins
- **Admin**: The authenticated administrator user of the PG management system

## Requirements

### Requirement 1: Dashboard Page Access

**User Story:** As an admin, I want to access the inflow management dashboard from the sidebar navigation, so that I can quickly view inflow metrics.

#### Acceptance Criteria

1. WHEN the admin navigates to the inflow dashboard route, THE Dashboard SHALL render the inflow management page within the existing admin layout
2. THE Sidebar SHALL display an "Inflow" navigation item with an appropriate icon
3. WHEN the admin is not authenticated, THE Dashboard SHALL redirect to the admin login page

### Requirement 2: Multi-Query Data Sync

**User Story:** As an admin, I want the dashboard to sync data from multiple Firebase collections, so that I have a unified view of all inflow-related information.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Sync_Engine SHALL fetch data from the tenants, visitors, sharing, and rent collections
2. WHILE data is being fetched, THE Dashboard SHALL display a loading indicator
3. IF a query source fails to respond, THEN THE Sync_Engine SHALL display an error message identifying the failed source and continue loading data from remaining sources
4. WHEN all query sources respond successfully, THE Dashboard SHALL aggregate the data into inflow metrics

### Requirement 3: Inflow Metrics Display

**User Story:** As an admin, I want to see key inflow metrics at a glance, so that I can understand the current state of tenant acquisition.

#### Acceptance Criteria

1. THE Dashboard SHALL display the total number of new tenants added in the current month
2. THE Dashboard SHALL display the total number of visitors (prospective tenants) in the current month
3. THE Dashboard SHALL display the conversion rate from visitor to confirmed tenant
4. THE Dashboard SHALL display the number of active referrals from the sharing collection
5. THE Dashboard SHALL display the current occupancy rate alongside inflow data for context

### Requirement 4: Inflow Trend Visualization

**User Story:** As an admin, I want to see inflow trends over time in chart form, so that I can identify patterns and seasonality.

#### Acceptance Criteria

1. THE Dashboard SHALL display a line chart showing daily inflow counts for the selected time period
2. WHEN the admin selects a different time range (7 days, 30 days, 90 days), THE Dashboard SHALL update the chart to reflect the selected period
3. THE Dashboard SHALL display a bar chart comparing monthly inflow totals for the current year
4. WHEN the admin hovers over a data point, THE Dashboard SHALL display a tooltip with the exact value and date

### Requirement 5: Daily Report Storage

**User Story:** As an admin, I want daily inflow reports to be stored automatically, so that I can review historical data and track progress over time.

#### Acceptance Criteria

1. WHEN the admin opens the dashboard for the first time on a given day, THE Sync_Engine SHALL generate and store a Daily_Report for that date in Firebase
2. THE Daily_Report SHALL contain the date, new tenant count, visitor count, conversion rate, referral count, and occupancy rate
3. IF a Daily_Report already exists for the current date, THEN THE Sync_Engine SHALL update the existing report rather than creating a duplicate
4. THE Dashboard SHALL allow the admin to view stored Daily_Reports for any past date within the last 90 days

### Requirement 6: Daily Report History View

**User Story:** As an admin, I want to browse and filter historical daily reports, so that I can compare performance across different periods.

#### Acceptance Criteria

1. THE Dashboard SHALL display a table of stored Daily_Reports sorted by date in descending order
2. WHEN the admin selects a date range filter, THE Dashboard SHALL display only reports within that range
3. WHEN the admin clicks on a specific Daily_Report row, THE Dashboard SHALL expand the row to show detailed metrics for that date
4. THE Dashboard SHALL provide an option to export the report history as a PDF

### Requirement 7: Inflow Pipeline Tracking

**User Story:** As an admin, I want to track where prospective tenants are in the inflow pipeline, so that I can follow up appropriately.

#### Acceptance Criteria

1. THE Dashboard SHALL display a pipeline view showing counts at each stage: Inquiry, Visit, Confirmation, Move-In
2. WHEN a visitor record is created, THE Dashboard SHALL categorize the visitor in the appropriate pipeline stage based on their status
3. WHEN the admin clicks on a pipeline stage, THE Dashboard SHALL display the list of individuals at that stage
4. THE Dashboard SHALL calculate and display the drop-off rate between consecutive pipeline stages

### Requirement 8: Real-Time Data Updates

**User Story:** As an admin, I want the dashboard to reflect changes in real time, so that I always see the latest inflow data without manual refresh.

#### Acceptance Criteria

1. WHILE the Dashboard is open, THE Sync_Engine SHALL subscribe to real-time updates from Firebase collections using existing subscription mechanisms
2. WHEN a new tenant or visitor record is added in Firebase, THE Dashboard SHALL update the displayed metrics within 5 seconds
3. WHEN the underlying data changes, THE Dashboard SHALL update charts and pipeline counts without requiring a page reload
