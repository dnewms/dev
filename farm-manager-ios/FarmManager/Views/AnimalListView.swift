//
//  AnimalListView.swift
//  FarmManager
//
//  Displays list of all animals with filtering options
//

import SwiftUI
import CoreData

struct AnimalListView: View {
    @Environment(\.managedObjectContext) private var viewContext

    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \Animal.name, ascending: true)],
        animation: .default)
    private var animals: FetchedResults<Animal>

    @State private var showingAddAnimal = false
    @State private var searchText = ""
    @State private var selectedType: String?
    @State private var selectedStatus: String = AnimalStatus.active.rawValue

    var filteredAnimals: [Animal] {
        animals.filter { animal in
            let matchesSearch = searchText.isEmpty ||
                animal.name?.localizedCaseInsensitiveContains(searchText) == true ||
                animal.tagNumber?.localizedCaseInsensitiveContains(searchText) == true

            let matchesType = selectedType == nil || animal.type == selectedType
            let matchesStatus = animal.status == selectedStatus

            return matchesSearch && matchesType && matchesStatus
        }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Status Filter
                Picker("Status", selection: $selectedStatus) {
                    ForEach(AnimalStatus.allCases) { status in
                        Text(status.rawValue).tag(status.rawValue)
                    }
                }
                .pickerStyle(.segmented)
                .padding()

                // Type Filter
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        FilterChip(title: "All", isSelected: selectedType == nil) {
                            selectedType = nil
                        }

                        ForEach(AnimalType.allCases) { type in
                            FilterChip(
                                title: "\(type.icon) \(type.rawValue)",
                                isSelected: selectedType == type.rawValue
                            ) {
                                selectedType = type.rawValue
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.bottom)

                // Animal List
                if filteredAnimals.isEmpty {
                    ContentUnavailableView {
                        Label("No Animals", systemImage: "pawprint.circle")
                    } description: {
                        Text("Add your first animal to get started")
                    } actions: {
                        Button("Add Animal") {
                            showingAddAnimal = true
                        }
                        .buttonStyle(.borderedProminent)
                        .controlSize(.large)
                    }
                } else {
                    List {
                        ForEach(filteredAnimals, id: \.id) { animal in
                            NavigationLink(destination: AnimalDetailView(animal: animal)) {
                                AnimalRow(animal: animal)
                            }
                        }
                        .onDelete(perform: deleteAnimals)
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Animals")
            .searchable(text: $searchText, prompt: "Search by name or tag")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingAddAnimal = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                    }
                }
            }
            .sheet(isPresented: $showingAddAnimal) {
                AddAnimalView()
            }
        }
    }

    private func deleteAnimals(offsets: IndexSet) {
        withAnimation {
            offsets.map { filteredAnimals[$0] }.forEach(viewContext.delete)

            do {
                try viewContext.save()
            } catch {
                let nsError = error as NSError
                print("Error deleting: \(nsError), \(nsError.userInfo)")
            }
        }
    }
}

struct AnimalRow: View {
    let animal: Animal

    var body: some View {
        HStack(spacing: 16) {
            // Photo or Icon
            if let photoData = animal.photoData, let uiImage = UIImage(data: photoData) {
                Image(uiImage: uiImage)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 70, height: 70)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            } else {
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(AnimalType(rawValue: animal.type ?? "")?.color.opacity(0.2) ?? Color.gray.opacity(0.2))
                        .frame(width: 70, height: 70)

                    Text(AnimalType(rawValue: animal.type ?? "")?.icon ?? "🐾")
                        .font(.system(size: 36))
                }
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(animal.name ?? "Unknown")
                    .font(.title3)
                    .fontWeight(.semibold)

                HStack(spacing: 8) {
                    Label(animal.tagNumber ?? "", systemImage: "tag.fill")
                        .font(.subheadline)
                        .foregroundColor(.secondary)

                    if let type = animal.type {
                        Text("•")
                            .foregroundColor(.secondary)
                        Text(type)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }

                if animal.currentWeight > 0 {
                    Text("\(Int(animal.currentWeight)) kg")
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.green.opacity(0.2))
                        .foregroundColor(.green)
                        .clipShape(Capsule())
                }
            }

            Spacer()

            Image(systemName: "chevron.right")
                .foregroundColor(.secondary)
                .font(.caption)
        }
        .padding(.vertical, 8)
    }
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.callout)
                .fontWeight(isSelected ? .semibold : .regular)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(isSelected ? Color.green : Color.gray.opacity(0.15))
                .foregroundColor(isSelected ? .white : .primary)
                .clipShape(Capsule())
        }
    }
}

#Preview {
    AnimalListView()
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}
