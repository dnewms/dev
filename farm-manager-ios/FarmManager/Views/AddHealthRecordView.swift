//
//  AddHealthRecordView.swift
//  FarmManager
//
//  Form for adding vaccination and health records
//

import SwiftUI

struct AddHealthRecordView: View {
    @ObservedObject var animal: Animal
    @Environment(\.managedObjectContext) private var viewContext
    @Environment(\.dismiss) private var dismiss

    @State private var vaccineName = ""
    @State private var type = "Vaccination"
    @State private var date = Date()
    @State private var dosage = ""
    @State private var veterinarian = ""
    @State private var nextDueDate: Date?
    @State private var enableNextDue = false
    @State private var notes = ""

    let recordTypes = ["Vaccination", "Deworming", "Treatment", "Checkup", "Other"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Record Information") {
                    TextField("Vaccine/Treatment Name", text: $vaccineName)
                        .font(.body)

                    Picker("Type", selection: $type) {
                        ForEach(recordTypes, id: \.self) { type in
                            Text(type)
                        }
                    }

                    DatePicker("Date", selection: $date, displayedComponents: .date)
                }

                Section("Details") {
                    TextField("Dosage (Optional)", text: $dosage)
                        .font(.body)

                    TextField("Veterinarian (Optional)", text: $veterinarian)
                        .font(.body)
                }

                Section("Next Due Date") {
                    Toggle("Set Next Due Date", isOn: $enableNextDue)

                    if enableNextDue {
                        DatePicker("Next Due", selection: Binding(
                            get: { nextDueDate ?? Date() },
                            set: { nextDueDate = $0 }
                        ), displayedComponents: .date)
                    }
                }

                Section("Notes") {
                    TextEditor(text: $notes)
                        .frame(minHeight: 100)
                        .font(.body)
                }
            }
            .navigationTitle("Add Health Record")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        saveRecord()
                    }
                    .disabled(vaccineName.isEmpty)
                    .fontWeight(.semibold)
                }
            }
        }
    }

    private func saveRecord() {
        let record = HealthRecord(context: viewContext)
        record.id = UUID()
        record.vaccineName = vaccineName
        record.type = type
        record.date = date
        record.dosage = dosage.isEmpty ? nil : dosage
        record.veterinarian = veterinarian.isEmpty ? nil : veterinarian
        record.nextDueDate = enableNextDue ? nextDueDate : nil
        record.notes = notes.isEmpty ? nil : notes
        record.animal = animal

        do {
            try viewContext.save()
            dismiss()
        } catch {
            let nsError = error as NSError
            print("Error saving health record: \(nsError), \(nsError.userInfo)")
        }
    }
}
