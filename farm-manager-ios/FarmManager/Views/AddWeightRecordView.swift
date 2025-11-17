//
//  AddWeightRecordView.swift
//  FarmManager
//
//  Form for recording animal weight measurements
//

import SwiftUI

struct AddWeightRecordView: View {
    @ObservedObject var animal: Animal
    @Environment(\.managedObjectContext) private var viewContext
    @Environment(\.dismiss) private var dismiss

    @State private var weight = ""
    @State private var date = Date()
    @State private var notes = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Weight Measurement") {
                    DatePicker("Date", selection: $date, displayedComponents: .date)

                    HStack {
                        TextField("Weight", text: $weight)
                            .keyboardType(.decimalPad)
                            .font(.title3)
                            .fontWeight(.semibold)

                        Text("kg")
                            .font(.title3)
                            .foregroundColor(.secondary)
                    }
                }

                Section("Notes") {
                    TextEditor(text: $notes)
                        .frame(minHeight: 100)
                        .font(.body)
                }

                if !weight.isEmpty, let weightValue = Double(weight) {
                    Section {
                        HStack {
                            Text("Change from current:")
                                .foregroundColor(.secondary)
                            Spacer()
                            let change = weightValue - animal.currentWeight
                            Text("\(change > 0 ? "+" : "")\(Int(change)) kg")
                                .fontWeight(.semibold)
                                .foregroundColor(change > 0 ? .green : (change < 0 ? .red : .secondary))
                        }
                    }
                }
            }
            .navigationTitle("Add Weight Record")
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
                    .disabled(weight.isEmpty)
                    .fontWeight(.semibold)
                }
            }
        }
    }

    private func saveRecord() {
        guard let weightValue = Double(weight) else { return }

        let record = WeightRecord(context: viewContext)
        record.id = UUID()
        record.date = date
        record.weight = weightValue
        record.notes = notes.isEmpty ? nil : notes
        record.animal = animal

        // Update animal's current weight
        animal.currentWeight = weightValue

        do {
            try viewContext.save()
            dismiss()
        } catch {
            let nsError = error as NSError
            print("Error saving weight record: \(nsError), \(nsError.userInfo)")
        }
    }
}
