//
//  ExportService.swift
//  FarmManager
//
//  Handles PDF and CSV export functionality
//

import Foundation
import CoreData
import PDFKit
import UIKit

class ExportService {
    let context: NSManagedObjectContext

    init(context: NSManagedObjectContext) {
        self.context = context
    }

    // MARK: - PDF Export

    func exportToPDF(reportType: ReportsView.ReportType, animals: [Animal]) throws -> URL {
        let pdfMetaData = [
            kCGPDFContextCreator: "FarmManager",
            kCGPDFContextAuthor: "Farm Owner",
            kCGPDFContextTitle: reportType.rawValue
        ]

        let format = UIGraphicsPDFRendererFormat()
        format.documentInfo = pdfMetaData as [String: Any]

        let pageRect = CGRect(x: 0, y: 0, width: 612, height: 792) // US Letter
        let renderer = UIGraphicsPDFRenderer(bounds: pageRect, format: format)

        let data = renderer.pdfData { context in
            context.beginPage()

            switch reportType {
            case .inventory:
                drawInventoryReport(in: pageRect, animals: animals)
            case .health:
                drawHealthReport(in: pageRect, animals: animals)
            case .weight:
                drawWeightReport(in: pageRect, animals: animals)
            case .financial:
                drawFinancialReport(in: pageRect, animals: animals)
            case .breeding:
                drawBreedingReport(in: pageRect, animals: animals)
            }
        }

        let url = FileManager.default.temporaryDirectory.appendingPathComponent("\(reportType.rawValue)_\(Date().formatted(date: .abbreviated, time: .omitted)).pdf")
        try data.write(to: url)

        return url
    }

    private func drawInventoryReport(in rect: CGRect, animals: [Animal]) {
        var yPosition: CGFloat = 50

        // Title
        let titleAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.boldSystemFont(ofSize: 24),
            .foregroundColor: UIColor.black
        ]
        let title = "Animal Inventory Report"
        title.draw(at: CGPoint(x: 50, y: yPosition), withAttributes: titleAttributes)
        yPosition += 40

        // Date
        let dateAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 12),
            .foregroundColor: UIColor.gray
        ]
        let dateString = "Generated: \(Date().formatted(date: .long, time: .shortened))"
        dateString.draw(at: CGPoint(x: 50, y: yPosition), withAttributes: dateAttributes)
        yPosition += 30

        // Summary
        let summaryAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 14),
            .foregroundColor: UIColor.black
        ]
        "Total Animals: \(animals.count)".draw(at: CGPoint(x: 50, y: yPosition), withAttributes: summaryAttributes)
        yPosition += 20

        let activeCount = animals.filter { $0.status == AnimalStatus.active.rawValue }.count
        "Active Animals: \(activeCount)".draw(at: CGPoint(x: 50, y: yPosition), withAttributes: summaryAttributes)
        yPosition += 30

        // Table header
        let headerAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.boldSystemFont(ofSize: 12),
            .foregroundColor: UIColor.white
        ]

        let headerRect = CGRect(x: 50, y: yPosition, width: rect.width - 100, height: 25)
        UIColor.systemGreen.setFill()
        UIBezierPath(roundedRect: headerRect, cornerRadius: 4).fill()

        "Name".draw(at: CGPoint(x: 60, y: yPosition + 5), withAttributes: headerAttributes)
        "Tag".draw(at: CGPoint(x: 200, y: yPosition + 5), withAttributes: headerAttributes)
        "Type".draw(at: CGPoint(x: 300, y: yPosition + 5), withAttributes: headerAttributes)
        "Weight".draw(at: CGPoint(x: 420, y: yPosition + 5), withAttributes: headerAttributes)
        yPosition += 30

        // Table rows
        let rowAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 11),
            .foregroundColor: UIColor.black
        ]

        for animal in animals.prefix(25) {
            (animal.name ?? "").draw(at: CGPoint(x: 60, y: yPosition), withAttributes: rowAttributes)
            (animal.tagNumber ?? "").draw(at: CGPoint(x: 200, y: yPosition), withAttributes: rowAttributes)
            (animal.type ?? "").draw(at: CGPoint(x: 300, y: yPosition), withAttributes: rowAttributes)
            "\(Int(animal.currentWeight)) kg".draw(at: CGPoint(x: 420, y: yPosition), withAttributes: rowAttributes)
            yPosition += 20

            if yPosition > rect.height - 50 {
                break
            }
        }
    }

    private func drawHealthReport(in rect: CGRect, animals: [Animal]) {
        var yPosition: CGFloat = 50

        let titleAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.boldSystemFont(ofSize: 24),
            .foregroundColor: UIColor.black
        ]
        "Health Records Report".draw(at: CGPoint(x: 50, y: yPosition), withAttributes: titleAttributes)
        yPosition += 60

        let rowAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 11),
            .foregroundColor: UIColor.black
        ]

        for animal in animals {
            if let healthRecords = animal.healthRecords?.allObjects as? [HealthRecord], !healthRecords.isEmpty {
                let animalHeader = "\(animal.name ?? "") (\(animal.tagNumber ?? ""))"
                let headerAttributes: [NSAttributedString.Key: Any] = [
                    .font: UIFont.boldSystemFont(ofSize: 13),
                    .foregroundColor: UIColor.black
                ]
                animalHeader.draw(at: CGPoint(x: 60, y: yPosition), withAttributes: headerAttributes)
                yPosition += 20

                for record in healthRecords.sorted(by: { ($0.date ?? Date()) > ($1.date ?? Date()) }).prefix(3) {
                    let recordText = "  • \(record.vaccineName ?? "") - \(record.date?.formatted(date: .abbreviated, time: .omitted) ?? "")"
                    recordText.draw(at: CGPoint(x: 70, y: yPosition), withAttributes: rowAttributes)
                    yPosition += 18

                    if yPosition > rect.height - 50 {
                        return
                    }
                }

                yPosition += 10
            }
        }
    }

    private func drawWeightReport(in rect: CGRect, animals: [Animal]) {
        var yPosition: CGFloat = 50

        let titleAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.boldSystemFont(ofSize: 24),
            .foregroundColor: UIColor.black
        ]
        "Weight Tracking Report".draw(at: CGPoint(x: 50, y: yPosition), withAttributes: titleAttributes)
        yPosition += 60

        let rowAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 11),
            .foregroundColor: UIColor.black
        ]

        for animal in animals {
            if let weightRecords = animal.weightRecords?.allObjects as? [WeightRecord], !weightRecords.isEmpty {
                let animalHeader = "\(animal.name ?? "") - Current: \(Int(animal.currentWeight)) kg"
                let headerAttributes: [NSAttributedString.Key: Any] = [
                    .font: UIFont.boldSystemFont(ofSize: 13),
                    .foregroundColor: UIColor.black
                ]
                animalHeader.draw(at: CGPoint(x: 60, y: yPosition), withAttributes: headerAttributes)
                yPosition += 20

                let sorted = weightRecords.sorted { ($0.date ?? Date()) < ($1.date ?? Date()) }
                for record in sorted.prefix(5) {
                    let recordText = "  • \(record.date?.formatted(date: .abbreviated, time: .omitted) ?? ""): \(Int(record.weight)) kg"
                    recordText.draw(at: CGPoint(x: 70, y: yPosition), withAttributes: rowAttributes)
                    yPosition += 18

                    if yPosition > rect.height - 50 {
                        return
                    }
                }

                yPosition += 10
            }
        }
    }

    private func drawFinancialReport(in rect: CGRect, animals: [Animal]) {
        var yPosition: CGFloat = 50

        let titleAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.boldSystemFont(ofSize: 24),
            .foregroundColor: UIColor.black
        ]
        "Financial Summary Report".draw(at: CGPoint(x: 50, y: yPosition), withAttributes: titleAttributes)
        yPosition += 60

        let totalPurchaseCost = animals.reduce(0.0) { $0 + $1.purchasePrice }
        var totalVetCosts = 0.0

        for animal in animals {
            if let vetVisits = animal.vetVisits?.allObjects as? [VetVisit] {
                totalVetCosts += vetVisits.reduce(0.0) { $0 + $1.cost }
            }
        }

        let summaryAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 14),
            .foregroundColor: UIColor.black
        ]

        "Total Purchase Cost: $\(Int(totalPurchaseCost))".draw(at: CGPoint(x: 60, y: yPosition), withAttributes: summaryAttributes)
        yPosition += 25
        "Total Veterinary Costs: $\(Int(totalVetCosts))".draw(at: CGPoint(x: 60, y: yPosition), withAttributes: summaryAttributes)
        yPosition += 25
        "Total Investment: $\(Int(totalPurchaseCost + totalVetCosts))".draw(at: CGPoint(x: 60, y: yPosition), withAttributes: summaryAttributes)
    }

    private func drawBreedingReport(in rect: CGRect, animals: [Animal]) {
        var yPosition: CGFloat = 50

        let titleAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.boldSystemFont(ofSize: 24),
            .foregroundColor: UIColor.black
        ]
        "Breeding Records Report".draw(at: CGPoint(x: 50, y: yPosition), withAttributes: titleAttributes)
        yPosition += 60

        let summaryAttributes: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 14),
            .foregroundColor: UIColor.black
        ]

        let femaleAnimals = animals.filter { $0.gender == AnimalGender.female.rawValue }
        "Total Breeding Females: \(femaleAnimals.count)".draw(at: CGPoint(x: 60, y: yPosition), withAttributes: summaryAttributes)
    }

    // MARK: - CSV Export

    func exportToCSV(reportType: ReportsView.ReportType, animals: [Animal]) throws -> URL {
        var csvText = ""

        switch reportType {
        case .inventory:
            csvText = generateInventoryCSV(animals: animals)
        case .health:
            csvText = generateHealthCSV(animals: animals)
        case .weight:
            csvText = generateWeightCSV(animals: animals)
        case .financial:
            csvText = generateFinancialCSV(animals: animals)
        case .breeding:
            csvText = generateBreedingCSV(animals: animals)
        }

        let url = FileManager.default.temporaryDirectory.appendingPathComponent("\(reportType.rawValue)_\(Date().formatted(date: .abbreviated, time: .omitted)).csv")
        try csvText.write(to: url, atomically: true, encoding: .utf8)

        return url
    }

    private func generateInventoryCSV(animals: [Animal]) -> String {
        var csv = "Name,Tag Number,Type,Gender,Breed,Date of Birth,Current Weight (kg),Status\n"

        for animal in animals {
            let row = [
                animal.name ?? "",
                animal.tagNumber ?? "",
                animal.type ?? "",
                animal.gender ?? "",
                animal.breed ?? "",
                animal.dateOfBirth?.formatted(date: .abbreviated, time: .omitted) ?? "",
                "\(animal.currentWeight)",
                animal.status ?? ""
            ].joined(separator: ",")

            csv += row + "\n"
        }

        return csv
    }

    private func generateHealthCSV(animals: [Animal]) -> String {
        var csv = "Animal Name,Tag Number,Vaccine/Treatment,Type,Date,Next Due,Veterinarian\n"

        for animal in animals {
            if let healthRecords = animal.healthRecords?.allObjects as? [HealthRecord] {
                for record in healthRecords {
                    let row = [
                        animal.name ?? "",
                        animal.tagNumber ?? "",
                        record.vaccineName ?? "",
                        record.type ?? "",
                        record.date?.formatted(date: .abbreviated, time: .omitted) ?? "",
                        record.nextDueDate?.formatted(date: .abbreviated, time: .omitted) ?? "",
                        record.veterinarian ?? ""
                    ].joined(separator: ",")

                    csv += row + "\n"
                }
            }
        }

        return csv
    }

    private func generateWeightCSV(animals: [Animal]) -> String {
        var csv = "Animal Name,Tag Number,Date,Weight (kg),Notes\n"

        for animal in animals {
            if let weightRecords = animal.weightRecords?.allObjects as? [WeightRecord] {
                for record in weightRecords.sorted(by: { ($0.date ?? Date()) < ($1.date ?? Date()) }) {
                    let row = [
                        animal.name ?? "",
                        animal.tagNumber ?? "",
                        record.date?.formatted(date: .abbreviated, time: .omitted) ?? "",
                        "\(record.weight)",
                        (record.notes ?? "").replacingOccurrences(of: ",", with: ";")
                    ].joined(separator: ",")

                    csv += row + "\n"
                }
            }
        }

        return csv
    }

    private func generateFinancialCSV(animals: [Animal]) -> String {
        var csv = "Animal Name,Tag Number,Purchase Price,Veterinary Costs,Total Cost\n"

        for animal in animals {
            var vetCosts = 0.0
            if let vetVisits = animal.vetVisits?.allObjects as? [VetVisit] {
                vetCosts = vetVisits.reduce(0.0) { $0 + $1.cost }
            }

            let row = [
                animal.name ?? "",
                animal.tagNumber ?? "",
                "\(animal.purchasePrice)",
                "\(vetCosts)",
                "\(animal.purchasePrice + vetCosts)"
            ].joined(separator: ",")

            csv += row + "\n"
        }

        return csv
    }

    private func generateBreedingCSV(animals: [Animal]) -> String {
        var csv = "Animal Name,Tag Number,Gender,Date of Birth,Age\n"

        let femaleAnimals = animals.filter { $0.gender == AnimalGender.female.rawValue }

        for animal in femaleAnimals {
            let age = animal.dateOfBirth.map { dob in
                let components = Calendar.current.dateComponents([.year, .month], from: dob, to: Date())
                return "\(components.year ?? 0)y \(components.month ?? 0)m"
            } ?? "Unknown"

            let row = [
                animal.name ?? "",
                animal.tagNumber ?? "",
                animal.gender ?? "",
                animal.dateOfBirth?.formatted(date: .abbreviated, time: .omitted) ?? "",
                age
            ].joined(separator: ",")

            csv += row + "\n"
        }

        return csv
    }
}
