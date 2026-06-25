// ─── Helpers ────────────────────────────────────────────────────────────────

const DEG = Math.PI / 180;

function factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid factorial');
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

// ─── Tokenizer ───────────────────────────────────────────────────────────────

type Token =
    | { type: 'number'; value: number }
    | { type: 'op'; value: string }
    | { type: 'func'; value: string }
    | { type: 'lparen' }
    | { type: 'rparen' };

const FUNCTIONS = [
    'asin', 'acos', 'atan',
    'sinh', 'cosh', 'tanh',
    'sin', 'cos', 'tan',
    'sqrt', 'log', 'ln',
    'abs',
];

export function tokenize(expr: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    const s = expr.replace(/\s+/g, '').replace(/π/g, 'pi').replace(/×/g, '*').replace(/÷/g, '/');

    while (i < s.length) {
        // Number
        if (/[0-9.]/.test(s[i])) {
            let num = '';
            while (i < s.length && /[0-9.]/.test(s[i])) num += s[i++];
            tokens.push({ type: 'number', value: parseFloat(num) });
            continue;
        }

        // Constants
        if (s.startsWith('pi', i)) {
            tokens.push({ type: 'number', value: Math.PI });
            i += 2;
            continue;
        }
        if (s[i] === 'e' && !/[a-z]/.test(s[i + 1] ?? '')) {
            tokens.push({ type: 'number', value: Math.E });
            i += 1;
            continue;
        }

        // Functions
        let matchedFunc = false;
        for (const fn of FUNCTIONS) {
            if (s.startsWith(fn, i)) {
                tokens.push({ type: 'func', value: fn });
                i += fn.length;
                matchedFunc = true;
                break;
            }
        }
        if (matchedFunc) continue;

        // Parentheses
        if (s[i] === '(') { tokens.push({ type: 'lparen' }); i++; continue; }
        if (s[i] === ')') { tokens.push({ type: 'rparen' }); i++; continue; }

        // Factorial
        if (s[i] === '!') { tokens.push({ type: 'op', value: '!' }); i++; continue; }

        // Operators
        if ('+-*/^'.includes(s[i])) {
            // Unary minus
            if (s[i] === '-' && (tokens.length === 0 || tokens[tokens.length - 1].type === 'lparen' || tokens[tokens.length - 1].type === 'op')) {
                tokens.push({ type: 'number', value: 0 });
            }
            tokens.push({ type: 'op', value: s[i] });
            i++;
            continue;
        }

        i++; // skip unknown chars
    }

    return tokens;
}

// ─── Shunting-Yard → RPN ────────────────────────────────────────────────────

const PRECEDENCE: Record<string, number> = {
    '+': 1, '-': 1,
    '*': 2, '/': 2,
    '^': 3, '!': 4,
};
const RIGHT_ASSOC = new Set(['^']);

function toRPN(tokens: Token[]): Token[] {
    const output: Token[] = [];
    const ops: Token[] = [];

    for (const tok of tokens) {
        if (tok.type === 'number') {
            output.push(tok);
        } else if (tok.type === 'func') {
            ops.push(tok);
        } else if (tok.type === 'op') {
            const prec = PRECEDENCE[tok.value] ?? 0;
            while (ops.length) {
                const top = ops[ops.length - 1];
                if (
                    top.type === 'func' ||
                    (top.type === 'op' &&
                        (PRECEDENCE[top.value] > prec ||
                            (PRECEDENCE[top.value] === prec && !RIGHT_ASSOC.has(tok.value))))
                ) {
                    output.push(ops.pop()!);
                } else break;
            }
            ops.push(tok);
        } else if (tok.type === 'lparen') {
            ops.push(tok);
        } else if (tok.type === 'rparen') {
            while (ops.length && ops[ops.length - 1].type !== 'lparen') {
                output.push(ops.pop()!);
            }
            ops.pop(); // discard lparen
            if (ops.length && ops[ops.length - 1].type === 'func') {
                output.push(ops.pop()!);
            }
        }
    }

    while (ops.length) output.push(ops.pop()!);
    return output;
}

// ─── RPN Evaluator ───────────────────────────────────────────────────────────

function evalRPN(rpn: Token[]): number {
    const stack: number[] = [];

    for (const tok of rpn) {
        if (tok.type === 'number') {
            stack.push(tok.value);
        } else if (tok.type === 'func') {
            const a = stack.pop()!;
            switch (tok.value) {
                case 'sin': stack.push(Math.sin(a * DEG)); break;
                case 'cos': stack.push(Math.cos(a * DEG)); break;
                case 'tan': stack.push(Math.tan(a * DEG)); break;
                case 'asin': stack.push(Math.asin(a) / DEG); break;
                case 'acos': stack.push(Math.acos(a) / DEG); break;
                case 'atan': stack.push(Math.atan(a) / DEG); break;
                case 'sinh': stack.push(Math.sinh(a)); break;
                case 'cosh': stack.push(Math.cosh(a)); break;
                case 'tanh': stack.push(Math.tanh(a)); break;
                case 'sqrt': stack.push(Math.sqrt(a)); break;
                case 'log': stack.push(Math.log10(a)); break;
                case 'ln': stack.push(Math.log(a)); break;
                case 'abs': stack.push(Math.abs(a)); break;
                default: throw new Error(`Unknown function: ${tok.value}`);
            }
        } else if (tok.type === 'op') {
            if (tok.value === '!') {
                const a = stack.pop()!;
                stack.push(factorial(a));
            } else {
                const b = stack.pop()!;
                const a = stack.pop()!;
                switch (tok.value) {
                    case '+': stack.push(a + b); break;
                    case '-': stack.push(a - b); break;
                    case '*': stack.push(a * b); break;
                    case '/':
                        if (b === 0) throw new Error('Division by zero');
                        stack.push(a / b);
                        break;
                    case '^': stack.push(Math.pow(a, b)); break;
                    default: throw new Error(`Unknown operator: ${tok.value}`);
                }
            }
        }
    }

    if (stack.length !== 1) throw new Error('Invalid expression');
    return stack[0];
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function evaluate(expr: string): number {
    const tokens = tokenize(expr);
    const rpn = toRPN(tokens);
    return evalRPN(rpn);
}

export function formatResult(value: number): string {
    if (!isFinite(value) || isNaN(value)) throw new Error('Invalid result');
    // Show up to 10 significant digits, strip trailing zeros
    const str = parseFloat(value.toPrecision(10)).toString();
    return str;
}

// ─── Combinatorics ───────────────────────────────────────────────────────────

export function nPr(n: number, r: number): number {
    if (r > n || n < 0 || r < 0) throw new Error('Invalid nPr input');
    return factorial(n) / factorial(n - r);
}

export function nCr(n: number, r: number): number {
    if (r > n || n < 0 || r < 0) throw new Error('Invalid nCr input');
    return factorial(n) / (factorial(r) * factorial(n - r));
}

// ─── Statistics ──────────────────────────────────────────────────────────────

export function parseNumberList(input: string): number[] {
    return input
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')
        .map((s) => {
            const n = parseFloat(s);
            if (isNaN(n)) throw new Error(`Invalid number: ${s}`);
            return n;
        });
}

export function mean(data: number[]): number {
    if (data.length === 0) throw new Error('Empty data set');
    return data.reduce((a, b) => a + b, 0) / data.length;
}

export function variance(data: number[]): number {
    const m = mean(data);
    return data.reduce((sum, x) => sum + Math.pow(x - m, 2), 0) / data.length;
}

export function stdDev(data: number[]): number {
    return Math.sqrt(variance(data));
}

export function median(data: number[]): number {
    if (data.length === 0) throw new Error('Empty data set');
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

// ─── Matrix Operations (2×2 to 4×4) ─────────────────────────────────────────

export type Matrix = number[][];

export function matAdd(A: Matrix, B: Matrix): Matrix {
    return A.map((row, i) => row.map((val, j) => val + B[i][j]));
}

export function matSub(A: Matrix, B: Matrix): Matrix {
    return A.map((row, i) => row.map((val, j) => val - B[i][j]));
}

export function matMul(A: Matrix, B: Matrix): Matrix {
    const rows = A.length;
    const cols = B[0].length;
    const inner = B.length;
    return Array.from({ length: rows }, (_, i) =>
        Array.from({ length: cols }, (_, j) =>
            Array.from({ length: inner }, (_, k) => A[i][k] * B[k][j]).reduce(
                (a, b) => a + b,
                0
            )
        )
    );
}

export function matDet(A: Matrix): number {
    const n = A.length;
    if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
    let det = 0;
    for (let j = 0; j < n; j++) {
        det += Math.pow(-1, j) * A[0][j] * matDet(minor(A, 0, j));
    }
    return det;
}

function minor(A: Matrix, row: number, col: number): Matrix {
    return A.filter((_, i) => i !== row).map((r) =>
        r.filter((_, j) => j !== col)
    );
}

export function matTranspose(A: Matrix): Matrix {
    return A[0].map((_, j) => A.map((row) => row[j]));
}

export function matFormatResult(M: Matrix): string {
    return M.map((row) => '[' + row.map((v) => parseFloat(v.toPrecision(6)).toString()).join(', ') + ']').join('\n');
}