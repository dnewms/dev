//
//  AnimalType.swift
//  FarmManager
//
//  Defines types of farm animals
//

import Foundation
import SwiftUI

enum AnimalType: String, CaseIterable, Identifiable {
    case cattle = "Cattle"
    case pig = "Pig"
    case chicken = "Chicken"
    case sheep = "Sheep"
    case goat = "Goat"
    case horse = "Horse"
    case duck = "Duck"
    case turkey = "Turkey"
    case rabbit = "Rabbit"

    var id: String { self.rawValue }

    var icon: String {
        switch self {
        case .cattle: return "🐄"
        case .pig: return "🐷"
        case .chicken: return "🐔"
        case .sheep: return "🐑"
        case .goat: return "🐐"
        case .horse: return "🐴"
        case .duck: return "🦆"
        case .turkey: return "🦃"
        case .rabbit: return "🐰"
        }
    }

    var color: Color {
        switch self {
        case .cattle: return .brown
        case .pig: return .pink
        case .chicken: return .orange
        case .sheep: return .gray
        case .goat: return .secondary
        case .horse: return .brown
        case .duck: return .yellow
        case .turkey: return .orange
        case .rabbit: return .gray
        }
    }
}

enum AnimalGender: String, CaseIterable, Identifiable {
    case male = "Male"
    case female = "Female"
    case unknown = "Unknown"

    var id: String { self.rawValue }
}

enum AnimalStatus: String, CaseIterable, Identifiable {
    case active = "Active"
    case sold = "Sold"
    case deceased = "Deceased"
    case quarantine = "Quarantine"

    var id: String { self.rawValue }

    var color: Color {
        switch self {
        case .active: return .green
        case .sold: return .blue
        case .deceased: return .gray
        case .quarantine: return .red
        }
    }
}
