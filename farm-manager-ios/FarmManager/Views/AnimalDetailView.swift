//
//  AnimalDetailView.swift
//  FarmManager
//
//  Detailed view of an individual animal with all records
//

import SwiftUI
import Charts

struct AnimalDetailView: View {
    @ObservedObject var animal: Animal
    @Environment(\.managedObjectContext) private var viewContext

    @State private var showingEditSheet = false
    @State private var showingAddHealth = false
    @State private var showingAddWeight = false
    @State private var showingAddVetVisit = false

    var sortedWeightRecords: [WeightRecord] {
        (animal.weightRecords?.allObjects as? [WeightRecord] ?? [])
            .sorted { $0.date ?? Date() < $1.date ?? Date() }
    }

    var sortedHealthRecords: [HealthRecord] {
        (animal.healthRecords?.allObjects as? [HealthRecord] ?? [])
            .sorted { $0.date ?? Date() > $1.date ?? Date() }
    }

    var sortedVetVisits: [VetVisit] {
        (animal.vetVisits?.allObjects as? [VetVisit] ?? [])
            .sorted { $0.date ?? Date() > $1.date ?? Date() }
    }

    var ageString: String {
        guard let dob = animal.dateOfBirth else { return "Unknown" }
        let components = Calendar.current.dateComponents([.year, .month], from: dob, to: Date())
        if let years = components.year, years > 0 {
            return "\(years)y \(components.month ?? 0)m"
        } else if let months = components.month {
            return "\(months) months"
        }
        return "Unknown"
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Header with Photo
                headerSection

                // Quick Stats
                quickStatsSection

                // Weight Chart
                if !sortedWeightRecords.isEmpty {
                    weightChartSection
                }

                // Health Records
                healthRecordsSection

                // Vet Visits
                vetVisitsSection

                // Feeding Schedules
                feedingSection
            }
            .padding()
        }
        .navigationTitle(animal.name ?? "Unknown")
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Menu {
                    Button(action: { showingEditSheet = true }) {
                        Label("Edit Details", systemImage: "pencil")
                    }

                    Button(action: { showingAddWeight = true }) {
                        Label("Add Weight", systemImage: "scalemass")
                    }

                    Button(action: { showingAddHealth = true }) {
                        Label("Add Health Record", systemImage: "cross.circle")
                    }

                    Button(action: { showingAddVetVisit = true }) {
                        Label("Add Vet Visit", systemImage: "stethoscope")
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .font(.title3)
                }
            }
        }
        .sheet(isPresented: $showingAddHealth) {
            AddHealthRecordView(animal: animal)
        }
        .sheet(isPresented: $showingAddWeight) {
            AddWeightRecordView(animal: animal)
        }
        .sheet(isPresented: $showingAddVetVisit) {
            AddVetVisitView(animal: animal)
        }
    }

    private var headerSection: some View {
        VStack(spacing: 16) {
            if let photoData = animal.photoData, let uiImage = UIImage(data: photoData) {
                Image(uiImage: uiImage)
                    .resizable()
                    .scaledToFill()
                    .frame(height: 250)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
            } else {
                ZStack {
                    RoundedRectangle(cornerRadius: 20)
                        .fill(AnimalType(rawValue: animal.type ?? "")?.color.opacity(0.2) ?? Color.gray.opacity(0.2))
                        .frame(height: 250)

                    Text(AnimalType(rawValue: animal.type ?? "")?.icon ?? "🐾")
                        .font(.system(size: 100))
                }
            }

            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(animal.name ?? "Unknown")
                        .font(.largeTitle)
                        .fontWeight(.bold)

                    HStack(spacing: 8) {
                        Label(animal.tagNumber ?? "", systemImage: "tag.fill")
                        Text("•")
                        Text(animal.type ?? "")
                    }
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                }

                Spacer()

                if let status = AnimalStatus(rawValue: animal.status ?? "") {
                    Text(status.rawValue)
                        .font(.caption)
                        .fontWeight(.semibold)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(status.color.opacity(0.2))
                        .foregroundColor(status.color)
                        .clipShape(Capsule())
                }
            }
        }
    }

    private var quickStatsSection: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
            StatCard(icon: "calendar", title: "Age", value: ageString, color: .blue)
            StatCard(icon: "scalemass", title: "Weight", value: "\(Int(animal.currentWeight)) kg", color: .green)
            StatCard(icon: "heart.text.square", title: "Gender", value: animal.gender ?? "Unknown", color: .pink)
            StatCard(icon: "paintpalette", title: "Breed", value: animal.breed ?? "Unknown", color: .purple)
        }
    }

    private var weightChartSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Weight History")
                    .font(.headline)
                Spacer()
                Button(action: { showingAddWeight = true }) {
                    Image(systemName: "plus.circle.fill")
                }
            }

            if sortedWeightRecords.count >= 2 {
                Chart(sortedWeightRecords, id: \.id) { record in
                    LineMark(
                        x: .value("Date", record.date ?? Date()),
                        y: .value("Weight", record.weight)
                    )
                    .interpolationMethod(.catmullRom)

                    PointMark(
                        x: .value("Date", record.date ?? Date()),
                        y: .value("Weight", record.weight)
                    )
                    .symbolSize(100)
                }
                .frame(height: 200)
                .chartXAxis {
                    AxisMarks(values: .automatic) { value in
                        AxisValueLabel(format: .dateTime.month().day())
                    }
                }
                .chartYAxis {
                    AxisMarks { value in
                        AxisValueLabel()
                    }
                }
            } else {
                Text("Add more weight records to see chart")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.gray.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 5)
    }

    private var healthRecordsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Health Records")
                    .font(.headline)
                Spacer()
                Button(action: { showingAddHealth = true }) {
                    Image(systemName: "plus.circle.fill")
                }
            }

            if sortedHealthRecords.isEmpty {
                Text("No health records yet")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.gray.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            } else {
                ForEach(sortedHealthRecords.prefix(3), id: \.id) { record in
                    HealthRecordRow(record: record)
                }

                if sortedHealthRecords.count > 3 {
                    Text("+ \(sortedHealthRecords.count - 3) more")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.top, 4)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 5)
    }

    private var vetVisitsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Veterinary Visits")
                    .font(.headline)
                Spacer()
                Button(action: { showingAddVetVisit = true }) {
                    Image(systemName: "plus.circle.fill")
                }
            }

            if sortedVetVisits.isEmpty {
                Text("No vet visits recorded")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.gray.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            } else {
                ForEach(sortedVetVisits.prefix(3), id: \.id) { visit in
                    VetVisitRow(visit: visit)
                }

                if sortedVetVisits.count > 3 {
                    Text("+ \(sortedVetVisits.count - 3) more")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.top, 4)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 5)
    }

    private var feedingSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Feeding Schedules")
                .font(.headline)

            Text("Coming in feeding schedule view")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.gray.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 5)
    }
}

struct StatCard: View {
    let icon: String
    let title: String
    let value: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)

            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)

            Text(value)
                .font(.headline)
                .fontWeight(.semibold)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(color.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

struct HealthRecordRow: View {
    let record: HealthRecord

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "cross.circle.fill")
                .font(.title2)
                .foregroundColor(.red)

            VStack(alignment: .leading, spacing: 4) {
                Text(record.vaccineName ?? "")
                    .font(.subheadline)
                    .fontWeight(.semibold)

                Text(record.date?.formatted(date: .abbreviated, time: .omitted) ?? "")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            if let nextDue = record.nextDueDate {
                VStack(alignment: .trailing, spacing: 4) {
                    Text("Next Due")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    Text(nextDue.formatted(date: .abbreviated, time: .omitted))
                        .font(.caption)
                        .foregroundColor(.orange)
                }
            }
        }
        .padding()
        .background(Color.gray.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

struct VetVisitRow: View {
    let visit: VetVisit

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "stethoscope")
                .font(.title2)
                .foregroundColor(.blue)

            VStack(alignment: .leading, spacing: 4) {
                Text(visit.reason ?? "")
                    .font(.subheadline)
                    .fontWeight(.semibold)

                Text(visit.veterinarianName ?? "")
                    .font(.caption)
                    .foregroundColor(.secondary)

                Text(visit.date?.formatted(date: .abbreviated, time: .omitted) ?? "")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            if visit.cost > 0 {
                Text("$\(Int(visit.cost))")
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.green)
            }
        }
        .padding()
        .background(Color.gray.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

#Preview {
    NavigationStack {
        if let animal = PersistenceController.preview.container.viewContext.registeredObjects.first(where: { $0 is Animal }) as? Animal {
            AnimalDetailView(animal: animal)
        }
    }
}
