//
//  FarmManagerApp.swift
//  FarmManager
//
//  Created by FarmManager Team
//

import SwiftUI

@main
struct FarmManagerApp: App {
    @StateObject private var persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
