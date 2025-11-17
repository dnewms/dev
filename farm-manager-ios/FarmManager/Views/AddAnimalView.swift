//
//  AddAnimalView.swift
//  FarmManager
//
//  Form for adding new animals with photo picker
//

import SwiftUI
import PhotosUI
import CoreData

struct AddAnimalView: View {
    @Environment(\.managedObjectContext) private var viewContext
    @Environment(\.dismiss) private var dismiss

    @State private var name = ""
    @State private var tagNumber = ""
    @State private var type: AnimalType = .cattle
    @State private var gender: AnimalGender = .female
    @State private var breed = ""
    @State private var color = ""
    @State private var dateOfBirth = Date()
    @State private var currentWeight = ""
    @State private var notes = ""
    @State private var selectedPhoto: PhotosPickerItem?
    @State private var photoData: Data?

    var body: some View {
        NavigationStack {
            Form {
                Section("Basic Information") {
                    TextField("Name", text: $name)
                        .font(.body)

                    TextField("Tag Number", text: $tagNumber)
                        .font(.body)

                    Picker("Type", selection: $type) {
                        ForEach(AnimalType.allCases) { animalType in
                            HStack {
                                Text(animalType.icon)
                                Text(animalType.rawValue)
                            }
                            .tag(animalType)
                        }
                    }

                    Picker("Gender", selection: $gender) {
                        ForEach(AnimalGender.allCases) { gender in
                            Text(gender.rawValue).tag(gender)
                        }
                    }
                }

                Section("Details") {
                    TextField("Breed (Optional)", text: $breed)
                        .font(.body)

                    TextField("Color (Optional)", text: $color)
                        .font(.body)

                    DatePicker("Date of Birth", selection: $dateOfBirth, displayedComponents: .date)

                    TextField("Current Weight (kg)", text: $currentWeight)
                        .keyboardType(.decimalPad)
                        .font(.body)
                }

                Section("Photo") {
                    PhotosPicker(selection: $selectedPhoto, matching: .images) {
                        HStack {
                            if let photoData, let uiImage = UIImage(data: photoData) {
                                Image(uiImage: uiImage)
                                    .resizable()
                                    .scaledToFill()
                                    .frame(width: 80, height: 80)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                            } else {
                                ZStack {
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(Color.gray.opacity(0.2))
                                        .frame(width: 80, height: 80)

                                    Image(systemName: "camera.fill")
                                        .font(.title2)
                                        .foregroundColor(.secondary)
                                }
                            }

                            VStack(alignment: .leading, spacing: 4) {
                                Text(photoData == nil ? "Add Photo" : "Change Photo")
                                    .font(.headline)
                                Text("Tap to select from library")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }

                            Spacer()
                        }
                    }
                }

                Section("Notes") {
                    TextEditor(text: $notes)
                        .frame(minHeight: 100)
                        .font(.body)
                }
            }
            .navigationTitle("Add Animal")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        saveAnimal()
                    }
                    .disabled(name.isEmpty || tagNumber.isEmpty)
                    .fontWeight(.semibold)
                }
            }
            .onChange(of: selectedPhoto) { _, newValue in
                Task {
                    if let data = try? await newValue?.loadTransferable(type: Data.self) {
                        photoData = data
                    }
                }
            }
        }
    }

    private func saveAnimal() {
        let newAnimal = Animal(context: viewContext)
        newAnimal.id = UUID()
        newAnimal.name = name
        newAnimal.tagNumber = tagNumber
        newAnimal.type = type.rawValue
        newAnimal.gender = gender.rawValue
        newAnimal.breed = breed.isEmpty ? nil : breed
        newAnimal.color = color.isEmpty ? nil : color
        newAnimal.dateOfBirth = dateOfBirth
        newAnimal.currentWeight = Double(currentWeight) ?? 0
        newAnimal.notes = notes.isEmpty ? nil : notes
        newAnimal.status = AnimalStatus.active.rawValue
        newAnimal.photoData = photoData

        // Create initial weight record if weight provided
        if let weight = Double(currentWeight), weight > 0 {
            let weightRecord = WeightRecord(context: viewContext)
            weightRecord.id = UUID()
            weightRecord.date = Date()
            weightRecord.weight = weight
            weightRecord.notes = "Initial weight"
            weightRecord.animal = newAnimal
        }

        do {
            try viewContext.save()
            dismiss()
        } catch {
            let nsError = error as NSError
            print("Error saving animal: \(nsError), \(nsError.userInfo)")
        }
    }
}

#Preview {
    AddAnimalView()
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}
