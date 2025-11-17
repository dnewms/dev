//
//  PersistenceController.swift
//  FarmManager
//
//  Manages CoreData stack with CloudKit sync support
//

import CoreData
import CloudKit

struct PersistenceController {
    static let shared = PersistenceController()

    static var preview: PersistenceController = {
        let controller = PersistenceController(inMemory: true)
        let viewContext = controller.container.viewContext

        // Create sample data for previews
        for i in 0..<10 {
            let animal = Animal(context: viewContext)
            animal.id = UUID()
            animal.name = "Sample \(AnimalType.allCases[i % AnimalType.allCases.count].rawValue) \(i + 1)"
            animal.type = AnimalType.allCases[i % AnimalType.allCases.count].rawValue
            animal.tagNumber = "TAG\(1000 + i)"
            animal.dateOfBirth = Calendar.current.date(byAdding: .month, value: -i * 6, to: Date())
            animal.currentWeight = Double.random(in: 100...500)
            animal.notes = "Sample animal for preview"
        }

        do {
            try viewContext.save()
        } catch {
            let nsError = error as NSError
            fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
        }

        return controller
    }()

    let container: NSPersistentCloudKitContainer

    init(inMemory: Bool = false) {
        container = NSPersistentCloudKitContainer(name: "FarmManager")

        if inMemory {
            container.persistentStoreDescriptions.first!.url = URL(fileURLWithPath: "/dev/null")
        } else {
            // Enable CloudKit sync (optional - user needs to enable iCloud in capabilities)
            guard let description = container.persistentStoreDescriptions.first else {
                fatalError("Could not retrieve a persistent store description.")
            }

            // Enable persistent history tracking for CloudKit
            description.setOption(true as NSNumber, forKey: NSPersistentHistoryTrackingKey)
            description.setOption(true as NSNumber, forKey: NSPersistentStoreRemoteChangeNotificationPostOptionKey)
        }

        container.loadPersistentStores { storeDescription, error in
            if let error = error as NSError? {
                // Replace this implementation with code to handle the error appropriately.
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        }

        container.viewContext.automaticallyMergesChangesFromParent = true
        container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
    }

    func save() {
        let context = container.viewContext

        if context.hasChanges {
            do {
                try context.save()
            } catch {
                let nsError = error as NSError
                print("Error saving context: \(nsError), \(nsError.userInfo)")
            }
        }
    }
}
