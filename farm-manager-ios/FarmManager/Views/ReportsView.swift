//
//  ReportsView.swift
//  FarmManager
//
//  Generate and export various farm reports (PDF/CSV)
//

import SwiftUI
import CoreData

struct ReportsView: View {
    @Environment(\.managedObjectContext) private var viewContext

    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \Animal.name, ascending: true)],
        animation: .default)
    private var animals: FetchedResults<Animal>

    @State private var showingExportSheet = false
    @State private var selectedReportType: ReportType = .inventory
    @State private var exportFormat: ExportFormat = .pdf
    @State private var shareItem: ShareItem?

    enum ReportType: String, CaseIterable, Identifiable {
        case inventory = "Animal Inventory"
        case health = "Health Records"
        case weight = "Weight Tracking"
        case financial = "Financial Summary"
        case breeding = "Breeding Records"

        var id: String { self.rawValue }
        var icon: String {
            switch self {
            case .inventory: return "list.bullet.clipboard"
            case .health: return "cross.circle"
            case .weight: return "scalemass"
            case .financial: return "dollarsign.circle"
            case .breeding: return "heart.circle"
            }
        }
    }

    enum ExportFormat: String, CaseIterable, Identifiable {
        case pdf = "PDF"
        case csv = "CSV"

        var id: String { self.rawValue }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Summary Cards
                    summarySection

                    // Quick Reports
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Reports")
                            .font(.title2)
                            .fontWeight(.bold)
                            .padding(.horizontal)

                        ForEach(ReportType.allCases) { reportType in
                            ReportCard(reportType: reportType) {
                                selectedReportType = reportType
                                showingExportSheet = true
                            }
                            .padding(.horizontal)
                        }
                    }
                }
                .padding(.vertical)
            }
            .navigationTitle("Reports")
            .sheet(isPresented: $showingExportSheet) {
                ExportOptionsView(
                    reportType: selectedReportType,
                    onExport: { format in
                        exportReport(type: selectedReportType, format: format)
                    }
                )
            }
            .sheet(item: $shareItem) { item in
                ShareSheet(items: [item.url])
            }
        }
    }

    private var summarySection: some View {
        VStack(spacing: 16) {
            Text("Farm Overview")
                .font(.title2)
                .fontWeight(.bold)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                SummaryCard(
                    title: "Total Animals",
                    value: "\(animals.count)",
                    icon: "pawprint.fill",
                    color: .green
                )

                SummaryCard(
                    title: "Active",
                    value: "\(animals.filter { $0.status == AnimalStatus.active.rawValue }.count)",
                    icon: "checkmark.circle.fill",
                    color: .blue
                )

                SummaryCard(
                    title: "Types",
                    value: "\(Set(animals.compactMap { $0.type }).count)",
                    icon: "square.grid.2x2",
                    color: .purple
                )

                SummaryCard(
                    title: "This Month",
                    value: "\(animalsAddedThisMonth)",
                    icon: "calendar",
                    color: .orange
                )
            }
            .padding(.horizontal)
        }
    }

    private var animalsAddedThisMonth: Int {
        let calendar = Calendar.current
        let now = Date()
        return animals.filter { animal in
            guard let purchaseDate = animal.purchaseDate else { return false }
            return calendar.isDate(purchaseDate, equalTo: now, toGranularity: .month)
        }.count
    }

    private func exportReport(type: ReportType, format: ExportFormat) {
        let exportService = ExportService(context: viewContext)

        do {
            let url: URL
            switch format {
            case .pdf:
                url = try exportService.exportToPDF(reportType: type, animals: Array(animals))
            case .csv:
                url = try exportService.exportToCSV(reportType: type, animals: Array(animals))
            }

            shareItem = ShareItem(url: url)
        } catch {
            print("Export failed: \(error)")
        }
    }
}

struct SummaryCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 32))
                .foregroundColor(color)

            Text(value)
                .font(.system(size: 36, weight: .bold))

            Text(title)
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .background(color.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

struct ReportCard: View {
    let reportType: ReportsView.ReportType
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: reportType.icon)
                    .font(.title2)
                    .foregroundColor(.white)
                    .frame(width: 50, height: 50)
                    .background(Color.green)
                    .clipShape(RoundedRectangle(cornerRadius: 12))

                VStack(alignment: .leading, spacing: 4) {
                    Text(reportType.rawValue)
                        .font(.headline)
                        .foregroundColor(.primary)

                    Text("Export report")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                Image(systemName: "arrow.down.doc")
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color(.systemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .shadow(color: .black.opacity(0.05), radius: 5)
        }
    }
}

struct ExportOptionsView: View {
    let reportType: ReportsView.ReportType
    let onExport: (ReportsView.ExportFormat) -> Void
    @Environment(\.dismiss) private var dismiss

    @State private var selectedFormat: ReportsView.ExportFormat = .pdf

    var body: some View {
        NavigationStack {
            Form {
                Section("Report Type") {
                    HStack {
                        Image(systemName: reportType.icon)
                            .foregroundColor(.green)
                        Text(reportType.rawValue)
                            .fontWeight(.semibold)
                    }
                }

                Section("Export Format") {
                    Picker("Format", selection: $selectedFormat) {
                        ForEach(ReportsView.ExportFormat.allCases) { format in
                            Text(format.rawValue).tag(format)
                        }
                    }
                    .pickerStyle(.segmented)
                }

                Section {
                    Button(action: {
                        onExport(selectedFormat)
                        dismiss()
                    }) {
                        HStack {
                            Spacer()
                            Label("Export Report", systemImage: "arrow.down.doc.fill")
                                .font(.headline)
                            Spacer()
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
                }
            }
            .navigationTitle("Export Options")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct ShareItem: Identifiable {
    let id = UUID()
    let url: URL
}

struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

#Preview {
    ReportsView()
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}
