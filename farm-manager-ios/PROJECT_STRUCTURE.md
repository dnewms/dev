# FarmManager - Project Structure

This document provides a detailed overview of the project's file organization and architecture.

## Directory Structure

```
farm-manager-ios/
├── FarmManager/                          # Main application target
│   ├── FarmManagerApp.swift             # App entry point (@main)
│   ├── Info.plist                       # App configuration and permissions
│   │
│   ├── Models/                          # Data models and enums
│   │   └── AnimalType.swift            # Animal types, genders, statuses
│   │
│   ├── Views/                           # SwiftUI views
│   │   ├── ContentView.swift           # Main tab navigation
│   │   │
│   │   ├── Animals/
│   │   ├── AnimalListView.swift        # List of all animals
│   │   ├── AddAnimalView.swift         # Form to add new animal
│   │   └── AnimalDetailView.swift      # Detailed animal view
│   │   │
│   │   ├── Health/
│   │   ├── AddHealthRecordView.swift   # Add vaccination/treatment
│   │   ├── HealthRecordsView.swift     # Health records overview
│   │   ├── AddWeightRecordView.swift   # Record weight measurement
│   │   └── AddVetVisitView.swift       # Log vet visit
│   │   │
│   │   ├── Feeding/
│   │   ├── FeedingScheduleView.swift   # List feeding schedules
│   │   └── AddFeedingScheduleView.swift # Create schedule
│   │   │
│   │   └── Reports/
│   │       └── ReportsView.swift       # Reports dashboard & export
│   │
│   ├── CoreData/                        # CoreData stack and models
│   │   ├── PersistenceController.swift # CoreData + CloudKit setup
│   │   └── FarmManager.xcdatamodeld/   # Data model definition
│   │       └── FarmManager.xcdatamodel/
│   │           └── contents            # Entity XML definition
│   │
│   ├── Services/                        # Business logic services
│   │   └── ExportService.swift         # PDF and CSV export
│   │
│   ├── Assets.xcassets/                 # Images, colors, icons
│   │   ├── Contents.json
│   │   ├── AppIcon.appiconset/         # App icon in all sizes
│   │   │   └── Contents.json
│   │   └── AccentColor.colorset/       # Primary theme color (green)
│   │       └── Contents.json
│   │
│   └── Preview Content/                 # Preview assets for SwiftUI
│       └── Preview Assets.xcassets/
│           └── Contents.json
│
├── FarmManager.xcodeproj/               # Xcode project configuration
│   └── project.pbxproj                  # Build settings and file references
│
├── README.md                            # Main documentation
├── SETUP_GUIDE.md                       # Quick setup instructions
├── FEATURES.md                          # Complete features list
├── CHANGELOG.md                         # Version history
├── PROJECT_STRUCTURE.md                 # This file
├── LICENSE                              # MIT License
└── .gitignore                          # Git ignore rules

```

## Architecture Overview

### Pattern: MVVM (Model-View-ViewModel)

#### Models (CoreData Entities)
- `Animal` - Core animal entity
- `HealthRecord` - Vaccinations and treatments
- `WeightRecord` - Weight measurements
- `VetVisit` - Veterinary appointments
- `FeedingSchedule` - Feeding plans
- `BreedingRecord` - Breeding history

#### Views (SwiftUI)
All views use SwiftUI declarative syntax with:
- `@State` for local state
- `@ObservedObject` for CoreData entities
- `@Environment(\.managedObjectContext)` for data access
- `@FetchRequest` for automatic CoreData queries

#### ViewModels (Implicit)
SwiftUI's property wrappers act as ViewModels:
- `@FetchRequest` provides reactive data
- Views observe CoreData changes automatically
- No explicit ViewModel classes needed for simple flows

### Data Flow

```
User Action
    ↓
SwiftUI View
    ↓
CoreData Context (PersistenceController)
    ↓
Local Database (SQLite)
    ↓ (if CloudKit enabled)
iCloud (NSPersistentCloudKitContainer)
    ↓
Other Devices
```

## File Descriptions

### Core Application Files

#### `FarmManagerApp.swift`
- App lifecycle entry point
- Scene configuration
- Injects CoreData context into environment

#### `Info.plist`
- App metadata (name, version, identifier)
- Permissions (Photos, Camera)
- Launch screen configuration
- Supported orientations

### Model Layer

#### `AnimalType.swift`
Defines enums for:
- **AnimalType** - cattle, pig, chicken, sheep, goat, horse, duck, turkey, rabbit
- **AnimalGender** - male, female, unknown
- **AnimalStatus** - active, sold, deceased, quarantine

Each enum includes:
- Icons (emoji representations)
- Colors (for UI theming)
- Identifiable conformance

### View Layer

#### Main Navigation
**`ContentView.swift`**
- TabView with 4 tabs
- Environment setup
- Global theme color (green)

#### Animal Management Views

**`AnimalListView.swift`**
- Displays all animals in a list
- Filtering by type and status
- Search functionality
- Swipe-to-delete
- Navigation to detail view

**`AddAnimalView.swift`**
- Form for creating new animals
- Photo picker integration
- Validation (name and tag required)
- Creates initial weight record

**`AnimalDetailView.swift`**
- Comprehensive animal details
- Quick stats cards
- Weight chart (Swift Charts)
- Health records preview
- Vet visits preview
- Action menu for adding records

#### Health Management Views

**`HealthRecordsView.swift`**
- Overdue vaccinations (red alerts)
- Upcoming vaccinations
- Complete health history
- Organized by animal

**`AddHealthRecordView.swift`**
- Form for vaccinations/treatments
- Type picker (Vaccination, Deworming, etc.)
- Next due date scheduling
- Veterinarian information

**`AddWeightRecordView.swift`**
- Simple weight entry form
- Date selection
- Weight change calculation
- Updates animal's current weight

**`AddVetVisitView.swift`**
- Comprehensive vet visit logging
- Diagnosis and treatment fields
- Cost tracking
- Follow-up scheduling

#### Feeding Management Views

**`FeedingScheduleView.swift`**
- "Today's Feeding" section
- All schedules list
- Reminder indicators
- Quick add button

**`AddFeedingScheduleView.swift`**
- Animal selection picker
- Feed type and amount
- Frequency options
- Reminder configuration

#### Reports Views

**`ReportsView.swift`**
- Farm overview statistics
- Report type selection
- Export format choice (PDF/CSV)
- Share sheet integration

### Data Layer

#### `PersistenceController.swift`
Manages:
- CoreData stack initialization
- CloudKit container setup
- In-memory store for previews
- Save operations
- Merge policies

Features:
- Singleton pattern (`shared`)
- Preview instance with sample data
- Automatic change merging
- Persistent history tracking

#### `FarmManager.xcdatamodeld`
Defines CoreData schema:
- 6 entities (Animal, HealthRecord, WeightRecord, VetVisit, FeedingSchedule, BreedingRecord)
- Relationships with cascade delete
- Attributes with types and defaults
- Code generation (NSManagedObject subclasses)

### Services Layer

#### `ExportService.swift`
Provides:
- PDF generation using UIGraphicsPDFRenderer
- CSV generation with proper formatting
- Multiple report types
- File management (temporary directory)
- Data formatting and presentation

Methods:
- `exportToPDF(reportType:animals:) -> URL`
- `exportToCSV(reportType:animals:) -> URL`
- Private rendering methods for each report type

## Code Generation

### CoreData Entities
CoreData entities are generated automatically by Xcode:
- Class Definition mode in data model
- Files generated at build time
- Not included in source control
- Available as `Animal`, `HealthRecord`, etc.

### SwiftUI Previews
Each view includes a `#Preview` macro:
- Uses preview data from `PersistenceController.preview`
- Enables live preview in Xcode Canvas
- Speeds up UI development

## Build Configuration

### Targets
- **FarmManager** (iOS App)

### Minimum Deployment
- iOS 17.0

### Frameworks Used
- SwiftUI (UI framework)
- CoreData (persistence)
- CloudKit (sync)
- Charts (weight graphs)
- PhotosUI (photo picker)
- PDFKit (PDF export)
- UIKit (sharing, PDF rendering)

### Capabilities Required
- iCloud (optional, for CloudKit)
- Background Modes (optional, for sync)

### Permissions Required
- Photo Library Access (`NSPhotoLibraryUsageDescription`)
- Camera Access (`NSCameraUsageDescription`)

## Testing Strategy

### Current State
- Preview-based manual testing
- SwiftUI previews for all views
- Sample data generation in `PersistenceController.preview`

### Recommended Additions
- Unit tests for `ExportService`
- Unit tests for data models
- UI tests for critical flows:
  - Add animal
  - Add health record
  - Generate report
- Integration tests for CoreData operations
- CloudKit sync tests

### Test Targets (To Be Added)
```
FarmManagerTests/           # Unit tests
├── Models/
├── Services/
└── CoreData/

FarmManagerUITests/         # UI tests
├── AnimalManagementTests.swift
├── HealthRecordsTests.swift
└── ReportsTests.swift
```

## Performance Considerations

### Optimizations Implemented
- Lazy loading in lists (SwiftUI default)
- `@FetchRequest` with predicates and limits
- External binary storage for photos
- Efficient CoreData fetching
- Merge policies to reduce conflicts

### Scalability
- Tested with up to 500 animals in preview
- Consider pagination for 1000+ animals
- Index critical fields (tag numbers, dates)
- Batch operations for bulk actions

### Memory Management
- CoreData faulting (automatic)
- SwiftUI automatic view recycling
- Image compression on save
- External storage for large binaries

## Extension Points

### Easy to Extend
1. **Add Animal Types**
   - Edit `AnimalType` enum in `Models/AnimalType.swift`

2. **Add New Fields to Animal**
   - Update CoreData model (`.xcdatamodeld`)
   - Rebuild to regenerate classes
   - Update forms and detail views

3. **Add New Report Types**
   - Add case to `ReportsView.ReportType`
   - Implement export logic in `ExportService`

4. **Add New Views**
   - Create SwiftUI view in `Views/`
   - Add to navigation in `ContentView` or detail views

5. **Add Notifications**
   - Implement `UNUserNotificationCenter`
   - Schedule based on feeding times or due dates
   - Add notification handling

## Dependencies

### No External Dependencies
This project uses only Apple frameworks:
- No CocoaPods
- No Swift Package Manager dependencies
- No third-party libraries

Benefits:
- Simple setup
- No dependency management
- Smaller app size
- Better App Store approval chances
- Long-term stability

### Potential Future Dependencies
- Charts library (if targeting iOS 16)
- CSV parsing library (for import feature)
- Analytics SDK (for usage tracking)
- Crash reporting (Crashlytics, Sentry)

## Build Settings

### Key Settings
- **Bundle Identifier**: `com.farmmanager.app` (change before release)
- **Development Team**: Set to your Apple Developer account
- **Code Signing**: Automatic
- **Swift Version**: 5.9
- **iOS Deployment Target**: 17.0

### Optimization
- **Debug**: No optimizations, debug symbols included
- **Release**: `-O` (optimize for speed), strip symbols

## Version Control

### Git Strategy
- Main branch for stable releases
- Feature branches for development
- Tag releases (v1.0.0, v1.1.0, etc.)

### .gitignore
Excludes:
- Build artifacts
- DerivedData
- User-specific Xcode files (xcuserdata)
- macOS system files (.DS_Store)
- Dependency folders (Pods, Carthage)

## Documentation Maintenance

### Keep Updated
When adding features:
1. Update `FEATURES.md` with new capabilities
2. Update `CHANGELOG.md` with version entry
3. Update `README.md` if architecture changes
4. Add setup steps to `SETUP_GUIDE.md` if needed
5. Update this `PROJECT_STRUCTURE.md` if files are added

---

**Last Updated:** 2025-01-XX (Initial Version)

For questions about the project structure, see [README.md](README.md) or contact the development team.
