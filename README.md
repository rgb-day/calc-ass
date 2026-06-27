markdown# SEN 104 & 214 Scientific Calculator App

[![Download APK](https://img.shields.io/badge/Download-APK-blue?logo=android&style=for-the-badge)](https://github.com/DiverseXL/sci-calculator-sen/releases/download/v1.0.0/calculator-sen-v1.0.0.apk)

A premium scientific calculator built with React Native (Expo) for Android with support for advanced mathematical operations.

## ✨ Features

### ✅ Basic Requirements
- Addition, Subtraction, Multiplication, Division
- Clear (AC), Delete (⌫), Parentheses
- Percentage calculations

### ✅ Bonus Features (Full Credits)
- **Trigonometric Functions**: sin, cos, tan, asin, acos, atan
- **Hyperbolic Functions**: sinh, cosh, tanh
- **Scientific Operations**: √, log, ln, x², xʸ, n!, constants (π, e)
- **Permutations & Combinations**: nPr, nCr
- **Statistics**: Mean (x̄), Median, Standard Deviation (σ)
- **Matrix Operations**: 2×2, 3×3, 4×4 matrices
  - Addition (A+B)
  - Subtraction (A-B)
  - Multiplication (A×B)
  - Determinant (det A)
  - Transpose (Aᵀ)
- **Calculation History**: Tap ⏱ to view and restore past calculations
- **Dark Mode UI**: Premium neon-themed interface
- **Angle Modes**: Degree/Radian toggle for trigonometry

## 🚀 How to Use

1. **Download the APK** using the button above
2. **Install** on your Android device
3. **Open** "Scientific Calculator"
4. **Toggle modes**:
   - Press **SCI** for scientific mode
   - Press **DEG/RAD** to switch angle modes
5. **View history** by tapping the ⏱ icon

## 🛠️ Technical Stack

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **Build Platform**: EAS Build (Expo)
- **Key Libraries**:
  - `shared_preferences` — For calculation history persistence
  - `react-native-web` — For web testing
- **Math Engine**: Custom shunting-yard parser for expression evaluation

## 📦 Build Info

- **Application ID**: `com.mccloned.calculatorsen`
- **Version**: 1.0.0 (Build 1)
- **Target**: Android 11+

## 📝 Project Structure
calculator-sen/

├── src/

│   ├── screens/

│   │   └── CalculatorScreen.tsx       # Main calculator UI

│   ├── components/

│   │   ├── Display.tsx                # Expression & result display

│   │   ├── CalcButton.tsx             # Button component

│   │   ├── Keypad.tsx                 # Button grid layout

│   │   ├── InputModal.tsx             # nPr, nCr, Stats input

│   │   └── MatrixModal.tsx            # Matrix operations UI

│   ├── mathEngine.ts                  # Math evaluation & operations

│   ├── keyLayouts.ts                  # Button definitions

│   └── theme.ts                       # Design system & colors

├── App.tsx                            # App entry point

├── pubspec.yaml                       # Dependencies

└── README.md                          # This file

## 🎓 Submission Details

- **Course**: SEN 104 & 214
- **Assignment**: Scientific Calculator Mobile App
- **Deadline**: June 30, 2026


---

**Made with ❤️ for SEN 214
