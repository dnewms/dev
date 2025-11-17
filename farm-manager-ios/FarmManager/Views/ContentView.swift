//
//  ContentView.swift
//  FarmManager
//
//  Main navigation view with large, farmer-friendly UI
//

import SwiftUI
import CoreData

struct ContentView: View {
    @Environment(\.managedObjectContext) private var viewContext

    var body: some View {
        TabView {
            AnimalListView()
                .tabItem {
                    Label("Animals", systemImage: "pawprint.circle.fill")
                }

            FeedingScheduleView()
                .tabItem {
                    Label("Feeding", systemImage: "clock.fill")
                }

            HealthRecordsView()
                .tabItem {
                    Label("Health", systemImage: "cross.circle.fill")
                }

            ReportsView()
                .tabItem {
                    Label("Reports", systemImage: "chart.bar.fill")
                }
        }
        .accentColor(.green)
    }
}

#Preview {
    ContentView()
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}
