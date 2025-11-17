//
//  FeedingScheduleView.swift
//  FarmManager
//
//  Manages feeding schedules and reminders for all animals
//

import SwiftUI
import CoreData

struct FeedingScheduleView: View {
    @Environment(\.managedObjectContext) private var viewContext

    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \FeedingSchedule.reminderTime, ascending: true)],
        animation: .default)
    private var schedules: FetchedResults<FeedingSchedule>

    @State private var showingAddSchedule = false
    @State private var selectedAnimal: Animal?

    var schedulesToday: [FeedingSchedule] {
        schedules.filter { schedule in
            guard let reminderTime = schedule.reminderTime else { return false }
            return Calendar.current.isDateInToday(reminderTime)
        }
    }

    var body: some View {
        NavigationStack {
            List {
                if !schedulesToday.isEmpty {
                    Section("Today's Feeding") {
                        ForEach(schedulesToday, id: \.id) { schedule in
                            FeedingScheduleRow(schedule: schedule)
                        }
                    }
                }

                Section("All Schedules") {
                    if schedules.isEmpty {
                        ContentUnavailableView {
                            Label("No Feeding Schedules", systemImage: "clock.fill")
                        } description: {
                            Text("Create feeding schedules for your animals")
                        } actions: {
                            Button("Add Schedule") {
                                showingAddSchedule = true
                            }
                            .buttonStyle(.borderedProminent)
                            .controlSize(.large)
                        }
                    } else {
                        ForEach(schedules, id: \.id) { schedule in
                            FeedingScheduleRow(schedule: schedule)
                        }
                        .onDelete(perform: deleteSchedules)
                    }
                }
            }
            .navigationTitle("Feeding Schedules")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingAddSchedule = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                    }
                }
            }
            .sheet(isPresented: $showingAddSchedule) {
                AddFeedingScheduleView()
            }
        }
    }

    private func deleteSchedules(offsets: IndexSet) {
        withAnimation {
            offsets.map { schedules[$0] }.forEach(viewContext.delete)

            do {
                try viewContext.save()
            } catch {
                let nsError = error as NSError
                print("Error deleting: \(nsError), \(nsError.userInfo)")
            }
        }
    }
}

struct FeedingScheduleRow: View {
    @ObservedObject var schedule: FeedingSchedule

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: schedule.reminderEnabled ? "bell.fill" : "bell.slash.fill")
                    .foregroundColor(schedule.reminderEnabled ? .orange : .gray)

                Text(schedule.animal?.name ?? "Unknown Animal")
                    .font(.headline)

                Spacer()

                if let reminderTime = schedule.reminderTime {
                    Text(reminderTime.formatted(date: .omitted, time: .shortened))
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
            }

            HStack(spacing: 16) {
                Label(schedule.feedType ?? "", systemImage: "leaf.fill")
                    .font(.caption)
                    .foregroundColor(.secondary)

                Label(schedule.amount ?? "", systemImage: "scalemass")
                    .font(.caption)
                    .foregroundColor(.secondary)

                Label(schedule.frequency ?? "", systemImage: "repeat")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            if let notes = schedule.notes, !notes.isEmpty {
                Text(notes)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
        }
        .padding(.vertical, 8)
    }
}

#Preview {
    FeedingScheduleView()
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}
