# Healthcare Dashboard - Component Documentation

## Created Components

All components have been successfully created in `/src/` and `/src/components/`.

### Component Files (541 total lines)

1. **HealthcareDashboard.js** (102 lines)
   - Main container component
   - Location: `/src/HealthcareDashboard.js`
   - Manages view state and renders header/footer
   - Imports provider data from `./data/providers.json`

2. **ViewSwitcher.js** (31 lines)
   - Location: `/src/components/ViewSwitcher.js`
   - Three-button toggle for view selection
   - Views: System / Frequency / Overview
   - Icons: Grid, List, Users

3. **ProviderCard.js** (195 lines)
   - Location: `/src/components/ProviderCard.js`
   - Reusable provider display card
   - Features:
     - Status badges (active, pending, remote, research)
     - Click-to-call phone links (`tel:`)
     - Click-to-email links (`mailto:`)
     - Collapsible notes section
     - Last visit and next appointment display
     - Insurance information
     - Organization details with address/website

4. **SystemView.js** (68 lines)
   - Location: `/src/components/SystemView.js`
   - Groups providers by body system
   - Colored headers matching system type:
     - Musculoskeletal (purple)
     - Mental Health (teal)
     - Sensory (orange)
     - Dental (blue)
     - Sleep (indigo)
     - Primary Care (green)

5. **FrequencyView.js** (74 lines)
   - Location: `/src/components/FrequencyView.js`
   - Groups providers by visit frequency
   - Urgency-based color coding:
     - High Priority (red): Twice weekly, Weekly
     - Regular Monitoring (amber): Monthly
     - Periodic (blue): Quarterly
     - Routine (gray): Biannual, Annual

6. **OverviewView.js** (71 lines)
   - Location: `/src/components/OverviewView.js`
   - Grid view of all providers
   - Status summary statistics
   - Sorted by status priority, then alphabetically

## Styling

All components use Tailwind CSS classes matching the existing RecoveryDashboard style:

### Color Palette
- **Primary Blues**: `blue-600`, `blue-500`, `blue-50`
- **Grays**: `slate-50`, `slate-100`, `slate-200`, `slate-600`, `slate-900`
- **Cards**: `bg-white` with `border-slate-200`
- **Status Colors**:
  - Active: `emerald-*` (green)
  - Pending: `amber-*` (yellow/orange)
  - Remote: `blue-*`
  - Research: `slate-*` (gray)

### Responsive Design
- Mobile-first approach
- Breakpoint: `lg:` (1024px)
- Grid layouts: 1 column mobile, 2 columns desktop
- Sticky header with mobile menu

## Features Implemented

### Provider Card Features
- ✅ Name, credentials, specialty display
- ✅ Organization and contact information
- ✅ Status badge with color coding
- ✅ Last visit and next appointment dates
- ✅ Collapsible notes section
- ✅ Click-to-call phone numbers (`tel:` links)
- ✅ Click-to-email addresses (`mailto:` links)
- ✅ Website links (opens in new tab)
- ✅ Address display with map icon
- ✅ Insurance information
- ✅ Visit frequency badge

### View Features
- ✅ **SystemView**: Grouped by body system with colored headers
- ✅ **FrequencyView**: Grouped by visit frequency with urgency indicators
- ✅ **OverviewView**: Responsive grid with status statistics
- ✅ View switcher with icons
- ✅ Mobile responsive with collapsible menu

### Additional Features
- ✅ Smooth animations (fade-in, slide-in)
- ✅ Hover effects on cards and buttons
- ✅ Sticky header
- ✅ Status count summaries
- ✅ Date formatting (locale-aware)
- ✅ Footer with provider statistics

## Integration with Existing App

To add the Healthcare Dashboard to your app:

### Option 1: Add as a new tab in RecoveryDashboard.js

```javascript
// In RecoveryDashboard.js, add to the tab navigation:
import HealthcareDashboard from './HealthcareDashboard';

// Add to TabButton section:
<TabButton
  active={activeTab === "healthcare"}
  label="Healthcare Team"
  icon={Heart}
  onClick={() => setActiveTab("healthcare")}
/>

// Add to renderContent switch:
case "healthcare":
  return <HealthcareDashboard />;
```

### Option 2: Use as standalone component

```javascript
// In App.js or index.js:
import HealthcareDashboard from './HealthcareDashboard';

// Render directly:
<HealthcareDashboard />
```

### Option 3: Add routing (if using React Router)

```javascript
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RecoveryDashboard from './RecoveryDashboard';
import HealthcareDashboard from './HealthcareDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecoveryDashboard />} />
        <Route path="/healthcare" element={<HealthcareDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Data Structure

The dashboard expects data in the format defined in `/src/data/providers.json`:

### Provider Object
```json
{
  "id": "unique-id",
  "name": "Provider Name",
  "credentials": "MD, DPT, etc.",
  "specialty": "Specialty description",
  "system": "system-id",
  "contact": {
    "organization": "Org Name",
    "phone": "(580) 123-4567",
    "email": "email@example.com",
    "address": "Full address",
    "website": "website.com"
  },
  "status": "active|pending|remote|research",
  "frequency": "weekly|monthly|quarterly|etc",
  "lastVisit": "2026-01-08",
  "nextAppointment": "2026-01-15T12:00:00",
  "notes": "Additional notes",
  "insurance": "Insurance info"
}
```

## Dependencies

The components use the following from `lucide-react`:
- Activity, Brain, Eye, Smile, Moon, Heart (system icons)
- Grid, List, Users (view switcher icons)
- Phone, Mail, MapPin, Calendar, Globe, Info (contact icons)
- ChevronDown, ChevronUp, Menu, X (UI icons)
- Clock, AlertCircle (frequency view icons)

All icons are already imported in RecoveryDashboard.js, so no additional installations needed.

## File Locations

```
/Users/jack.reis/Documents/rib-recovery-dashboard/
├── src/
│   ├── HealthcareDashboard.js (main container)
│   ├── RecoveryDashboard.js (existing)
│   ├── components/
│   │   ├── ViewSwitcher.js
│   │   ├── ProviderCard.js
│   │   ├── SystemView.js
│   │   ├── FrequencyView.js
│   │   └── OverviewView.js
│   └── data/
│       └── providers.json (existing)
```

## Testing the Dashboard

1. Import the HealthcareDashboard component in your app
2. The dashboard will automatically load provider data from `providers.json`
3. Test all three views: System, Frequency, Overview
4. Test mobile responsiveness (resize browser)
5. Test click-to-call and click-to-email functionality
6. Expand/collapse notes sections on provider cards

## Next Steps

To enhance the dashboard further, consider:
- Add search/filter functionality
- Add appointment scheduling modal
- Integrate with calendar API
- Add provider comparison feature
- Export provider list as PDF
- Add reminder notifications for upcoming appointments
