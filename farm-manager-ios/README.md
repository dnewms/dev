# FarmManager - Farm Animal Management iOS App

<div align="center">

**A comprehensive, farmer-friendly iOS app for managing farm animals, health records, feeding schedules, and more.**

![iOS 17+](https://img.shields.io/badge/iOS-17.0%2B-blue)
![Swift 5.9](https://img.shields.io/badge/Swift-5.9-orange)
![SwiftUI](https://img.shields.io/badge/UI-SwiftUI-green)
![CoreData](https://img.shields.io/badge/Database-CoreData-purple)

</div>

## Features

### Core Functionality

- **Animal Inventory Management**
  - Support for multiple animal types (cattle, pigs, chickens, sheep, goats, horses, ducks, turkeys, rabbits)
  - Tag number tracking and identification
  - Breed, color, and gender information
  - Status tracking (Active, Sold, Deceased, Quarantine)
  - Photo attachments for each animal

- **Health Records & Vaccination Tracking**
  - Comprehensive vaccination history
  - Deworming and treatment records
  - Next due date reminders
  - Veterinarian information logging
  - Overdue vaccination alerts

- **Feeding Schedules & Reminders**
  - Custom feeding schedules per animal
  - Multiple frequency options (Daily, Twice Daily, Every 2 Days, Weekly, As Needed)
  - Feed type and amount tracking
  - Optional push notifications for feeding times

- **Weight Tracking**
  - Historical weight records with dates
  - Visual weight charts using Swift Charts
  - Weight gain/loss calculations
  - Notes for each weight measurement

- **Veterinary Visit Logging**
  - Complete visit history
  - Diagnosis and treatment records
  - Cost tracking
  - Follow-up date scheduling
  - Veterinarian contact information

- **Breeding Records**
  - Mother and father tracking
  - Expected due dates
  - Birth records
  - Offspring counting
  - Breeding outcomes

- **Reports & Exports**
  - **PDF Reports:**
    - Animal Inventory Report
    - Health Records Summary
    - Weight Tracking Charts
    - Financial Summary
    - Breeding Records
  - **CSV Exports:**
    - Complete data export for spreadsheet analysis
    - All report types available in CSV format
  - Easy sharing via iOS Share Sheet

- **Offline-First Architecture**
  - Full functionality without internet connection
  - CoreData for local storage
  - Optional CloudKit sync across devices

### User Experience

- **Farmer-Friendly Design**
  - Large touch targets (60pt minimum)
  - High contrast, readable fonts
  - Simple, intuitive navigation
  - Quick access to common tasks
  - Minimal data entry required

- **Smart Filtering**
  - Filter by animal type
  - Filter by status (Active, Sold, etc.)
  - Search by name or tag number
  - Quick access to overdue health records

## Screenshots Mockups

### 1. Animal List View
- Grid/List view of all animals
- Large animal photos or type icons
- Quick stats (name, tag, type, weight)
- Filter chips at the top (Cattle, Pigs, Chickens, etc.)
- Status badges (Active/Sold/Deceased)
- Large green "+" button for adding animals

### 2. Animal Detail View
- Hero image/photo section at top
- Quick stats cards (Age, Weight, Gender, Breed)
- Weight tracking chart with smooth animations
- Health records timeline
- Recent vet visits
- Feeding schedules
- Action menu for quick tasks

### 3. Add Animal Form
- Clean, segmented form layout
- Large input fields
- Photo picker with preview
- Date pickers with calendar interface
- Type selection with emoji icons
- Save button prominently displayed

### 4. Health Records View
- Section for overdue vaccinations (red alert)
- Upcoming vaccinations section
- Complete history with expandable rows
- Color-coded by urgency
- Quick add button

### 5. Feeding Schedule View
- Today's feeding section at top
- Time-based organization
- Toggle switches for reminders
- Frequency badges
- Animal photos next to schedules

### 6. Reports Dashboard
- Summary cards with statistics
- Large report type cards
- Export format selection (PDF/CSV)
- Share sheet integration
- Visual icons for each report type

## Tech Stack

- **Framework:** SwiftUI (iOS 17+)
- **Database:** CoreData with NSPersistentCloudKitContainer
- **Cloud Sync:** CloudKit (optional)
- **Charts:** Swift Charts framework
- **Image Handling:** PhotosUI framework
- **Document Export:** PDFKit and CSV generation
- **Architecture:** MVVM pattern
- **Language:** Swift 5.9+

## Requirements

- Xcode 15.0 or later
- iOS 17.0 or later
- macOS 13.0 or later (for development)
- Apple Developer Account (for device testing and App Store submission)

## Installation & Setup

### 1. Clone or Download the Project

```bash
cd farm-manager-ios
```

### 2. Open in Xcode

```bash
open FarmManager.xcodeproj
```

Or simply double-click `FarmManager.xcodeproj` in Finder.

### 3. Configure Signing

1. Select the **FarmManager** project in the navigator
2. Select the **FarmManager** target
3. Go to **Signing & Capabilities** tab
4. Select your **Team** from the dropdown
5. Xcode will automatically manage provisioning profiles

### 4. Configure CloudKit (Optional)

If you want to enable iCloud sync:

1. In **Signing & Capabilities**, click **+ Capability**
2. Add **iCloud**
3. Check **CloudKit**
4. Ensure the CloudKit container is created
5. Add **Background Modes** capability
6. Check **Remote notifications**

### 5. Update Bundle Identifier

1. Change the bundle identifier from `com.farmmanager.app` to your own (e.g., `com.yourname.farmmanager`)
2. This is required for App Store submission

## Building and Running

### Simulator

1. Select an iPhone simulator from the scheme picker (e.g., iPhone 15 Pro)
2. Press `Cmd + R` or click the **Play** button
3. The app will build and launch in the simulator

### Physical Device

1. Connect your iPhone or iPad via USB
2. Select your device from the scheme picker
3. Press `Cmd + R` to build and run
4. If prompted, trust your developer certificate on the device

### Running Tests

```bash
# Run all tests
Cmd + U

# Or via command line
xcodebuild test -scheme FarmManager -destination 'platform=iOS Simulator,name=iPhone 15 Pro'
```

## Project Structure

```
FarmManager/
├── FarmManagerApp.swift          # App entry point
├── Info.plist                    # App configuration
│
├── Models/
│   └── AnimalType.swift          # Enums and type definitions
│
├── Views/
│   ├── ContentView.swift         # Main tab navigation
│   ├── AnimalListView.swift      # Animal inventory list
│   ├── AddAnimalView.swift       # Add new animal form
│   ├── AnimalDetailView.swift    # Animal details & records
│   ├── AddHealthRecordView.swift # Add health/vaccination record
│   ├── AddWeightRecordView.swift # Add weight measurement
│   ├── AddVetVisitView.swift     # Log veterinary visit
│   ├── FeedingScheduleView.swift # Feeding schedules list
│   ├── AddFeedingScheduleView.swift # Create feeding schedule
│   ├── HealthRecordsView.swift   # Health records overview
│   └── ReportsView.swift         # Reports & export interface
│
├── CoreData/
│   ├── PersistenceController.swift # CoreData stack manager
│   └── FarmManager.xcdatamodeld/  # Data model definition
│       └── FarmManager.xcdatamodel/
│           └── contents            # Entity definitions
│
├── Services/
│   └── ExportService.swift       # PDF/CSV export functionality
│
└── Assets.xcassets/              # Images and colors
```

## CoreData Entities

### Animal
- **Attributes:** id, name, tagNumber, type, breed, gender, color, dateOfBirth, currentWeight, status, notes, photoData, purchaseDate, purchasePrice, motherTagNumber
- **Relationships:** healthRecords, weightRecords, vetVisits, feedingSchedules

### HealthRecord
- **Attributes:** id, vaccineName, type, date, dosage, veterinarian, nextDueDate, notes
- **Relationships:** animal (inverse)

### WeightRecord
- **Attributes:** id, date, weight, notes
- **Relationships:** animal (inverse)

### VetVisit
- **Attributes:** id, date, veterinarianName, reason, diagnosis, treatment, cost, followUpDate, notes
- **Relationships:** animal (inverse)

### FeedingSchedule
- **Attributes:** id, feedType, amount, frequency, startDate, reminderTime, reminderEnabled, notes
- **Relationships:** animal (inverse)

### BreedingRecord
- **Attributes:** id, motherTagNumber, fatherTagNumber, breedingDate, expectedDueDate, birthDate, numberOfOffspring, outcome, notes
- **Relationships:** None (standalone records)

## Customization

### Adding New Animal Types

Edit `FarmManager/Models/AnimalType.swift`:

```swift
enum AnimalType: String, CaseIterable, Identifiable {
    // ... existing cases
    case donkey = "Donkey"
    case llama = "Llama"

    var icon: String {
        switch self {
        // ... existing cases
        case .donkey: return "🫏"
        case .llama: return "🦙"
        }
    }
}
```

### Customizing Colors

Edit the color definitions in `AnimalType.swift` or add custom colors to `Assets.xcassets/`.

### Modifying Report Templates

Edit `FarmManager/Services/ExportService.swift` to customize PDF layouts and CSV formats.

## App Store Submission Guide

### Preparation

1. **App Icon**
   - Create app icons in all required sizes (1024x1024, 180x180, etc.)
   - Add to `Assets.xcassets/AppIcon.appiconset/`
   - Use a farm-related design (barn, tractor, animals)

2. **Screenshots**
   - Capture screenshots on required devices:
     - 6.7" (iPhone 15 Pro Max)
     - 6.5" (iPhone 14 Plus)
     - 5.5" (iPhone 8 Plus)
   - Show key features: animal list, detail view, charts, reports
   - Use Xcode's screenshot tool or physical devices

3. **Privacy Policy**
   - Create a privacy policy (required if using CloudKit)
   - Host it on a public URL
   - Explain data collection and usage

4. **App Description**
   ```
   FarmManager helps farmers efficiently manage their livestock with ease.

   Features:
   • Track unlimited animals across your farm
   • Monitor health records and vaccinations
   • Schedule feeding times with reminders
   • Chart weight gain and growth
   • Log veterinary visits and costs
   • Generate comprehensive reports (PDF/CSV)
   • Works offline with optional cloud sync

   Designed specifically for farmers with large touch targets and simple navigation.
   ```

5. **Keywords**
   ```
   farm, livestock, cattle, agriculture, animal management, farming,
   ranch, dairy, vaccination, weight tracking, vet records
   ```

### Build Archive

1. Select **Any iOS Device** as the build target
2. Product → Archive
3. Wait for archive to complete
4. In Organizer, click **Distribute App**
5. Choose **App Store Connect**
6. Follow the wizard to upload

### App Store Connect Configuration

1. **Create App Record**
   - Log in to [App Store Connect](https://appstoreconnect.apple.com)
   - Click **My Apps** → **+** → **New App**
   - Fill in app information

2. **Pricing & Availability**
   - Set price tier (recommend: Free or $4.99-$9.99)
   - Select available countries

3. **App Information**
   - Upload app icon (1024x1024)
   - Add screenshots for each device size
   - Write app description and keywords
   - Set category: **Productivity** or **Business**
   - Set age rating (4+)

4. **Build Upload**
   - Select your uploaded build
   - Wait for processing (~30-60 minutes)
   - Add export compliance information
   - Add version release notes

5. **Submit for Review**
   - Answer App Review questions
   - Provide demo account if needed
   - Add review notes if necessary
   - Submit

### Review Process

- Typical review time: 24-48 hours
- Monitor status in App Store Connect
- Respond promptly to any rejection feedback
- Common rejection reasons:
  - Missing privacy policy
  - Incomplete metadata
  - Crashes during review
  - Permissions not properly explained

### Post-Approval

1. **Release Options:**
   - Manual release (you control when)
   - Automatic release after approval

2. **Marketing:**
   - Share on farming forums and social media
   - Reach out to farming publications
   - Create demo videos for YouTube
   - Offer promo codes to influencers

3. **Updates:**
   - Regularly update with bug fixes
   - Add new features based on user feedback
   - Respond to App Store reviews

## Future Enhancements

### Potential Features

- [ ] Expense tracking and budgeting
- [ ] Milk production tracking (for dairy)
- [ ] Egg production logging (for chickens)
- [ ] Weather integration
- [ ] Pasture rotation management
- [ ] Birth notifications and alerts
- [ ] Multi-farm management
- [ ] Medication inventory
- [ ] Feed inventory tracking
- [ ] Staff/worker management
- [ ] Breeding cycle calendar
- [ ] Vaccination reminders with push notifications
- [ ] Integration with veterinary clinics
- [ ] Export to accounting software
- [ ] Apple Watch companion app
- [ ] Widget support for iOS 17
- [ ] iPad multi-column layout
- [ ] Dark mode optimization
- [ ] Localization (multiple languages)

### Technical Improvements

- [ ] Unit tests for models and services
- [ ] UI tests for critical flows
- [ ] Performance optimization for large datasets (1000+ animals)
- [ ] Image compression and optimization
- [ ] Background sync improvements
- [ ] Conflict resolution for CloudKit
- [ ] Offline queue for sync failures

## Troubleshooting

### Build Errors

**"No account for team" error:**
- Go to Xcode → Settings → Accounts
- Add your Apple ID
- Download certificates

**"Failed to create provisioning profile":**
- Check bundle identifier is unique
- Ensure you have an active developer program membership

### Runtime Issues

**CloudKit not syncing:**
- Verify iCloud is enabled in Signing & Capabilities
- Check CloudKit Dashboard for errors
- Ensure device is signed in to iCloud

**Photos not loading:**
- Check Info.plist has NSPhotoLibraryUsageDescription
- Grant photo permissions in Settings

**App crashes on launch:**
- Check CoreData model is properly configured
- Verify all view files are included in the target

### Performance Issues

**Slow list scrolling:**
- Optimize large images (compress before saving)
- Consider pagination for 500+ animals
- Use `.task` instead of `.onAppear` for async operations

**High memory usage:**
- Enable external binary storage for photos in CoreData
- Implement image thumbnail system
- Clear cached data periodically

## Contributing

This is a template/starter project. Feel free to:

- Fork and customize for your needs
- Add features and submit pull requests
- Report bugs and suggest improvements
- Share with other farmers and developers

## License

This project is provided as-is for educational and commercial use. You are free to:

- Use it in your own projects
- Modify and distribute
- Publish to the App Store under your own account
- Use for commercial purposes

**No attribution required, but appreciated!**

## Support

For questions, issues, or feature requests:

- Open an issue on GitHub (if applicable)
- Check the troubleshooting section above
- Review Apple's [SwiftUI documentation](https://developer.apple.com/documentation/swiftui)
- Visit [Apple Developer Forums](https://developer.apple.com/forums/)

## Acknowledgments

- Built with SwiftUI and CoreData
- Icons from SF Symbols
- Chart functionality from Swift Charts
- Inspired by real farm management needs

---

**Made with care for farmers and livestock managers everywhere.**

Happy farming! 🌾🐄🐷🐔
