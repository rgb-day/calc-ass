export interface KeyDef {
    label: string;
    insert?: string;
    action?: string;
    color?: 'number' | 'operator' | 'equals' | 'function' | 'clear' | 'special';
    small?: boolean;
}

// ─── Basic Keypad ────────────────────────────────────────────────────────────

export const BASIC_ROWS: KeyDef[][] = [
    [
        { label: 'AC', action: 'clear', color: 'clear' },
        { label: '( )', insert: '(', color: 'special' },
        { label: '%', insert: '%', color: 'special' },
        { label: '÷', insert: '/', color: 'operator' },
    ],
    [
        { label: '7', insert: '7', color: 'number' },
        { label: '8', insert: '8', color: 'number' },
        { label: '9', insert: '9', color: 'number' },
        { label: '×', insert: '*', color: 'operator' },
    ],
    [
        { label: '4', insert: '4', color: 'number' },
        { label: '5', insert: '5', color: 'number' },
        { label: '6', insert: '6', color: 'number' },
        { label: '−', insert: '-', color: 'operator' },
    ],
    [
        { label: '1', insert: '1', color: 'number' },
        { label: '2', insert: '2', color: 'number' },
        { label: '3', insert: '3', color: 'number' },
        { label: '+', insert: '+', color: 'operator' },
    ],
    [
        { label: '+/-', insert: '-', color: 'number' },
        { label: '0', insert: '0', color: 'number' },
        { label: '.', insert: '.', color: 'number' },
        { label: '=', action: 'equals', color: 'equals' },
    ],
];

// ─── Scientific Keypad ───────────────────────────────────────────────────────

export const SCIENTIFIC_ROWS: KeyDef[][] = [
    [
        { label: 'sin', insert: 'sin(', color: 'function', small: true },
        { label: 'cos', insert: 'cos(', color: 'function', small: true },
        { label: 'tan', insert: 'tan(', color: 'function', small: true },
        { label: 'sin⁻¹', insert: 'asin(', color: 'function', small: true },
        { label: 'cos⁻¹', insert: 'acos(', color: 'function', small: true },
        { label: 'tan⁻¹', insert: 'atan(', color: 'function', small: true },
    ],
    [
        { label: 'sinh', insert: 'sinh(', color: 'function', small: true },
        { label: 'cosh', insert: 'cosh(', color: 'function', small: true },
        { label: 'tanh', insert: 'tanh(', color: 'function', small: true },
        { label: 'log', insert: 'log(', color: 'function', small: true },
        { label: 'ln', insert: 'ln(', color: 'function', small: true },
        { label: '√', insert: 'sqrt(', color: 'function', small: true },
    ],
    [
        { label: 'x²', insert: '^2', color: 'function', small: true },
        { label: 'xʸ', insert: '^', color: 'function', small: true },
        { label: 'n!', insert: '!', color: 'function', small: true },
        { label: 'π', insert: 'pi', color: 'function', small: true },
        { label: 'e', insert: 'e', color: 'function', small: true },
        { label: 'abs', insert: 'abs(', color: 'function', small: true },
    ],
    [
        { label: 'nPr', action: 'nPr', color: 'special', small: true },
        { label: 'nCr', action: 'nCr', color: 'special', small: true },
        { label: 'x̄', action: 'stats-mean', color: 'special', small: true },
        { label: 'σ', action: 'stats-std', color: 'special', small: true },
        { label: 'Med', action: 'stats-med', color: 'special', small: true },
        { label: 'MAT', action: 'matrix', color: 'special', small: true },
    ],
    [
        { label: '⌫', action: 'delete', color: 'special', small: true },
        { label: '(', insert: '(', color: 'special', small: true },
        { label: ')', insert: ')', color: 'special', small: true },
        { label: 'DEG', action: 'toggleDeg', color: 'special', small: true },
        { label: 'SCI', action: 'toggleMode', color: 'special', small: true },
        { label: '÷', insert: '/', color: 'operator', small: true },
    ],
];