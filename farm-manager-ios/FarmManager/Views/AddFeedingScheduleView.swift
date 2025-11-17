//
//  AddFeedingScheduleView.swift
//  FarmManager
//
//  Form for creating feeding schedules with reminders
//

import SwiftUI
import CoreData

struct AddFeedingScheduleView: View {
    @Environment(\.managedObjectContext) private var viewContext
    @Environment(\.dismiss) private var dismiss

    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \Animal.name, ascending: true)],
        predicate: NSPredicate(format: "status == %@", AnimalStatus.active.rawValue),
        animation: .default)
    private var animals: FetchedResults<Animal>

    @State private var selectedAnimal: Animal?
    @State private var feedType = ""
    @State private var amount = ""
    @State private var frequency = "Daily"
    @State private var startDate = Date()
    @State private var reminderEnabled = true
    @State private var reminderTime = Date()
    @State private var notes = ""

    let frequencies = ["Daily", "Twice Daily", "Every 2 Days", "Weekly", "As Needed"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Animal") {
                    Picker("Select Animal", selection: $selectedAnimal) {
                        Text("Choose an animal").tag(nil as Animal?)
                        ForEach(animals, id: \.id) { animal in
                            HStack {
                                Text(AnimalType(rawValue: animal.type ?? "")?.icon ?? "")
                                Text(animal.name ?? "")
                            }
                            .tag(animal as Animal?)
                        }
                    }
                }

                Section("Feed Details") {
                    TextField("Feed Type (e.g., Hay, Grain)", text: $feedType)
                        .font(.body)

                    TextField("Amount (e.g., 2 kg, 3 cups)", text: $amount)
                        .font(.body)

                    Picker("Frequency", selection: $frequency) {
                        ForEach(frequencies, id: \.self) { freq in
                            Text(freq)
                        }
                    }

                    DatePicker("Start Date", selection: $startDate, displayedComponents: .date)
                }

                Section("Reminder") {
                    Toggle("Enable Reminder", isOn: $reminderEnabled)

                    if reminderEnabled {
                        DatePicker("Reminder Time", selection: $reminderTime, displayedComponents: .hourAndMinute)
                    }
                }

                Section("Notes") {
                    TextEditor(text: $notes)
                        .frame(minHeight: 80)
                        .font(.body)
                }
            }
            .navigationTitle("Add Feeding Schedule")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        saveSchedule()
                    }
                    .disabled(selectedAnimal == nil || feedType.isEmpty || amount.isEmpty)
                    .fontWeight(.semibold)
                }
            }
        }
    }

    private func saveSchedule() {
        guard let animal = selectedAnimal else { return }

        let schedule = FeedingSchedule(context: viewContext)
        schedule.id = UUID()
        schedule.feedType = feedType
        schedule.amount = amount
        schedule.frequency = frequency
        schedule.startDate = startDate
        schedule.reminderEnabled = reminderEnabled
        schedule.reminderTime = reminderEnabled ? reminderTime : nil
        schedule.notes = notes.isEmpty ? nil : notes
        schedule.animal = animal

        do {
            try viewContext.save()
            dismiss()
        } catch {
            let nsError = error as NSError
            print("Error saving schedule: \(nsError), \(nsError.userInfo)")
        }
    }
}
