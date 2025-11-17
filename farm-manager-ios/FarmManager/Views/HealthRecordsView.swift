//
//  HealthRecordsView.swift
//  FarmManager
//
//  Overview of all health records and upcoming vaccinations
//

import SwiftUI
import CoreData

struct HealthRecordsView: View {
    @Environment(\.managedObjectContext) private var viewContext

    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \HealthRecord.date, ascending: false)],
        animation: .default)
    private var healthRecords: FetchedResults<HealthRecord>

    var upcomingRecords: [HealthRecord] {
        healthRecords.filter { record in
            guard let nextDue = record.nextDueDate else { return false }
            return nextDue > Date()
        }.sorted { ($0.nextDueDate ?? Date()) < ($1.nextDueDate ?? Date()) }
    }

    var overdueRecords: [HealthRecord] {
        healthRecords.filter { record in
            guard let nextDue = record.nextDueDate else { return false }
            return nextDue < Date()
        }
    }

    var body: some View {
        NavigationStack {
            List {
                if !overdueRecords.isEmpty {
                    Section {
                        ForEach(overdueRecords, id: \.id) { record in
                            HealthRecordDetailRow(record: record, showOverdue: true)
                        }
                    } header: {
                        Label("Overdue", systemImage: "exclamationmark.triangle.fill")
                            .foregroundColor(.red)
                    }
                }

                if !upcomingRecords.isEmpty {
                    Section("Upcoming") {
                        ForEach(upcomingRecords.prefix(5), id: \.id) { record in
                            HealthRecordDetailRow(record: record, showOverdue: false)
                        }
                    }
                }

                Section("All Records") {
                    if healthRecords.isEmpty {
                        ContentUnavailableView {
                            Label("No Health Records", systemImage: "cross.circle")
                        } description: {
                            Text("Health records will appear here")
                        }
                    } else {
                        ForEach(healthRecords.prefix(20), id: \.id) { record in
                            HealthRecordDetailRow(record: record, showOverdue: false)
                        }
                    }
                }
            }
            .navigationTitle("Health Records")
        }
    }
}

struct HealthRecordDetailRow: View {
    @ObservedObject var record: HealthRecord
    let showOverdue: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(record.animal?.name ?? "Unknown")
                        .font(.headline)

                    HStack(spacing: 8) {
                        if let type = record.animal?.type {
                            Text(AnimalType(rawValue: type)?.icon ?? "")
                                .font(.caption)
                        }
                        Text(record.animal?.tagNumber ?? "")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                Spacer()

                if showOverdue {
                    Image(systemName: "exclamationmark.circle.fill")
                        .foregroundColor(.red)
                        .font(.title2)
                }
            }

            Divider()

            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(record.vaccineName ?? "")
                        .font(.subheadline)
                        .fontWeight(.semibold)

                    Text(record.type ?? "")
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 2)
                        .background(Color.blue.opacity(0.2))
                        .foregroundColor(.blue)
                        .clipShape(Capsule())
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 4) {
                    if let date = record.date {
                        Text("Given:")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                        Text(date.formatted(date: .abbreviated, time: .omitted))
                            .font(.caption)
                    }
                }
            }

            if let nextDue = record.nextDueDate {
                HStack {
                    Image(systemName: "calendar")
                        .foregroundColor(.orange)
                    Text("Next due: \(nextDue.formatted(date: .abbreviated, time: .omitted))")
                        .font(.caption)
                        .foregroundColor(showOverdue ? .red : .orange)
                }
            }

            if let notes = record.notes, !notes.isEmpty {
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
    HealthRecordsView()
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}
