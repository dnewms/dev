# Quick Setup Guide

Get FarmManager running in 5 minutes!

## Prerequisites

- macOS 13.0+ (Ventura or later)
- Xcode 15.0 or later
- iOS 17.0+ device or simulator
- Apple Developer Account (free or paid)

## Step-by-Step Setup

### 1. Open Project (30 seconds)

```bash
cd farm-manager-ios
open FarmManager.xcodeproj
```

### 2. Configure Signing (2 minutes)

1. Click on **FarmManager** project in the left sidebar
2. Select **FarmManager** target
3. Go to **Signing & Capabilities** tab
4. Under **Signing**, select your **Team** from dropdown
5. Change **Bundle Identifier** to something unique (e.g., `com.yourname.farmmanager`)

### 3. Select Destination (10 seconds)

In the Xcode toolbar at the top:
- Click the device selector next to the scheme name
- Choose **iPhone 15 Pro** simulator (or any iPhone model)

### 4. Build & Run (2 minutes)

Press **⌘ + R** or click the **▶** Play button

Wait for:
- Dependencies to resolve
- Project to build (~30 seconds first time)
- Simulator to launch
- App to install and open

### 5. Explore the App

The app will launch with sample data in preview mode. Try:

1. **Add an Animal**
   - Tap the **+** button in the Animals tab
   - Fill in the form (Name and Tag Number required)
   - Optionally add a photo
   - Tap **Save**

2. **View Animal Details**
   - Tap on any animal in the list
   - Explore health records, weight tracking, and vet visits
   - Use the **⋯** menu to add records

3. **Create Feeding Schedule**
   - Go to **Feeding** tab
   - Tap **+** to add a schedule
   - Select an animal and configure feeding details
   - Enable reminders if desired

4. **Generate Reports**
   - Go to **Reports** tab
   - Tap on any report type
   - Choose PDF or CSV format
   - Share via the iOS share sheet

## Running on Your iPhone

### Prerequisites
- iPhone with iOS 17.0+
- USB cable
- Trust your Mac on the iPhone

### Steps

1. Connect your iPhone to your Mac via USB
2. Unlock your iPhone
3. In Xcode, select your iPhone from the device list (top toolbar)
4. Press **⌘ + R** to build and run
5. On first run, you may need to:
   - Go to iPhone **Settings** → **General** → **VPN & Device Management**
   - Tap your developer account
   - Tap **Trust**
6. Return to the app and launch it

## Enabling CloudKit Sync (Optional)

If you want data to sync across devices via iCloud:

### 1. Add iCloud Capability

1. In Xcode, select **FarmManager** target
2. Go to **Signing & Capabilities**
3. Click **+ Capability** button
4. Search for and add **iCloud**
5. Check **CloudKit**
6. Ensure container is selected/created

### 2. Add Background Modes

1. Click **+ Capability** again
2. Add **Background Modes**
3. Check **Remote notifications**

### 3. Sign in to iCloud

- Ensure your iPhone/iPad is signed in to iCloud
- Go to **Settings** → **[Your Name]** → **iCloud**
- Make sure iCloud Drive is enabled

### 4. Test Sync

1. Add an animal on one device
2. Wait a few seconds
3. Open the app on another device
4. The animal should appear automatically

## Common Issues & Solutions

### "No account for team"

**Solution:**
1. Xcode → Settings (⌘ + ,)
2. Go to **Accounts** tab
3. Click **+** and add your Apple ID
4. Close settings and try again

### "Failed to create provisioning profile"

**Solution:**
- Make sure your bundle identifier is unique
- Try changing it to `com.yourname.farmmanager.app`
- Clean build folder (Shift + ⌘ + K)
- Try building again

### "iPhone is not available"

**Solution:**
- Make sure iPhone is unlocked
- Check USB cable connection
- Try a different USB port
- Restart Xcode

### App crashes on launch

**Solution:**
1. In Xcode, go to **Product** → **Clean Build Folder** (Shift + ⌘ + K)
2. Delete app from simulator/device
3. Build and run again

### Photos not working

**Solution:**
- Check that `NSPhotoLibraryUsageDescription` is in Info.plist (it should be)
- Grant photo permissions when prompted
- If not prompted, go to iPhone **Settings** → **FarmManager** → **Photos** → **All Photos**

## Next Steps

### Customize the App

1. **Change App Icon**
   - Add your icon images to `Assets.xcassets/AppIcon.appiconset/`
   - Use 1024x1024 for App Store icon

2. **Add More Animal Types**
   - Edit `FarmManager/Models/AnimalType.swift`
   - Add new cases with icons

3. **Customize Colors**
   - Edit `AccentColor.colorset` in Assets
   - Modify color values in `AnimalType.swift`

### Prepare for App Store

See the full [README.md](README.md) for:
- App Store submission guide
- Marketing tips
- Screenshots requirements
- Privacy policy template

## Getting Help

- **Documentation:** See [README.md](README.md) for complete docs
- **Apple Developer Docs:** [developer.apple.com/documentation](https://developer.apple.com/documentation)
- **SwiftUI Tutorials:** [developer.apple.com/tutorials/swiftui](https://developer.apple.com/tutorials/swiftui)
- **Stack Overflow:** Tag questions with `swiftui`, `coredata`, `ios`

## Performance Tips

- **Large farms (500+ animals):** Consider adding pagination
- **High-res photos:** App will auto-compress, but pre-compress large images
- **Slow syncing:** Check iCloud storage and network connection
- **Memory warnings:** Enable external storage for photos in CoreData (already enabled)

---

**Ready to manage your farm?** Start adding animals and explore the features!

Questions? Check the main [README.md](README.md) for troubleshooting and FAQs.
