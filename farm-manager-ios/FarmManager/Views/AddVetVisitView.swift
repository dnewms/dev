//
//  AddVetVisitView.swift
//  FarmManager
//
//  Form for logging veterinary visits
//

import SwiftUI

struct AddVetVisitView: View {
    @ObservedObject var animal: Animal
    @Environment(\.managedObjectContext) private var viewContext
    @Environment(\.dismiss) private var dismiss

    @State private var veterinarianName = ""
    @State private var date = Date()
    @State private var reason = ""
    @State private var diagnosis = ""
    @State private var treatment = ""
    @State private var cost = ""
    @State private var followUpDate: Date?
    @State private var enableFollowUp = false
    @State private var notes = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Visit Information") {
                    TextField("Veterinarian Name", text: $veterinarianName)
                        .font(.body)

                    DatePicker("Visit Date", selection: $date, displayedComponents: .date)

                    TextField("Reason for Visit", text: $reason)
                        .font(.body)
                }

                Section("Diagnosis & Treatment") {
                    TextField("Diagnosis (Optional)", text: $diagnosis, axis: .vertical)
                        .lineLimit(2...4)
                        .font(.body)

                    TextField("Treatment (Optional)", text: $treatment, axis: .vertical)
                        .lineLimit(2...4)
                        .font(.body)
                }

                Section("Cost") {
                    HStack {
                        Text("$")
                            .foregroundColor(.secondary)
                        TextField("0.00", text: $cost)
                            .keyboardType(.decimalPad)
                            .font(.body)
                    }
                }

                Section("Follow-up") {
                    Toggle("Schedule Follow-up", isOn: $enableFollowUp)

                    if enableFollowUp {
                        DatePicker("Follow-up Date", selection: Binding(
                            get: { followUpDate ?? Date() },
                            set: { followUpDate = $0 }
                        ), displayedComponents: .date)
                    }
                }

                Section("Notes") {
                    TextEditor(text: $notes)
                        .frame(minHeight: 100)
                        .font(.body)
                }
            }
            .navigationTitle("Add Vet Visit")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        saveVisit()
                    }
                    .disabled(veterinarianName.isEmpty || reason.isEmpty)
                    .fontWeight(.semibold)
                }
            }
        }
    }

    private func saveVisit() {
        let visit = VetVisit(context: viewContext)
        visit.id = UUID()
        visit.veterinarianName = veterinarianName
        visit.date = date
        visit.reason = reason
        visit.diagnosis = diagnosis.isEmpty ? nil : diagnosis
        visit.treatment = treatment.isEmpty ? nil : treatment
        visit.cost = Double(cost) ?? 0
        visit.followUpDate = enableFollowUp ? followUpDate : nil
        visit.notes = notes.isEmpty ? nil : notes
        visit.animal = animal

        do {
            try viewContext.save()
            dismiss()
        } catch {
            let nsError = error as NSError
            print("Error saving vet visit: \(nsError), \(nsError.userInfo)")
        }
    }
}
