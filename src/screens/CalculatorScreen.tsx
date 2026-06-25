import React, { useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Text,
    Pressable,
    ScrollView,
} from 'react-native';
import { theme } from '../theme';
import { BASIC_ROWS, SCIENTIFIC_ROWS, KeyDef } from '../keyLayouts';
import Display from '../components/Display';
import Keypad from '../components/Keypad';
import InputModal from '../components/InputModal';
import MatrixModal from '../components/MatrixModal';
import {
    evaluate,
    formatResult,
    nPr,
    nCr,
    mean,
    median,
    stdDev,
    parseNumberList,
} from '../mathEngine';

type Mode = 'basic' | 'scientific';
type ModalType = 'nPr' | 'nCr' | 'stats' | 'none';
type StatOp = 'mean' | 'std' | 'median';

export default function CalculatorScreen() {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('0');
    const [preview, setPreview] = useState('');
    const [isError, setIsError] = useState(false);
    const [justEvaluated, setJustEvaluated] = useState(false);
    const [mode, setMode] = useState<Mode>('basic');
    const [isDeg, setIsDeg] = useState(true);
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [modal, setModal] = useState<ModalType>('none');
    const [statOp, setStatOp] = useState<StatOp>('mean');
    const [showMatrix, setShowMatrix] = useState(false);

    // ── Live preview ────────────────────────────────────────────────────────────
    const updatePreview = (expr: string) => {
        if (expr.length < 2) { setPreview(''); return; }
        try {
            const val = evaluate(expr);
            setPreview(formatResult(val));
        } catch {
            setPreview('');
        }
    };

    // ── Insert character ────────────────────────────────────────────────────────
    const insert = useCallback((text: string) => {
        setIsError(false);
        setJustEvaluated(false);
        const next = expression + text;
        setExpression(next);
        updatePreview(next);
    }, [expression]);

    // ── Evaluate ────────────────────────────────────────────────────────────────
    const equals = useCallback(() => {
        if (!expression) return;
        try {
            const val = evaluate(expression);
            const formatted = formatResult(val);
            setHistory((h) => [`${expression} = ${formatted}`, ...h.slice(0, 49)]);
            setResult(formatted);
            setExpression(formatted);
            setPreview('');
            setJustEvaluated(true);
            setIsError(false);
        } catch (e: any) {
            setResult(e.message ?? 'Error');
            setIsError(true);
            setJustEvaluated(true);
            setPreview('');
        }
    }, [expression]);

    // ── Delete ──────────────────────────────────────────────────────────────────
    const deleteLast = useCallback(() => {
        setIsError(false);
        setJustEvaluated(false);
        const next = expression.slice(0, -1);
        setExpression(next);
        updatePreview(next);
    }, [expression]);

    // ── Clear ───────────────────────────────────────────────────────────────────
    const clear = useCallback(() => {
        setExpression('');
        setResult('0');
        setPreview('');
        setIsError(false);
        setJustEvaluated(false);
    }, []);

    // ── Key handler ─────────────────────────────────────────────────────────────
    const handleKey = useCallback((key: KeyDef) => {
        if (key.action) {
            switch (key.action) {
                case 'clear': clear(); break;
                case 'equals': equals(); break;
                case 'delete': deleteLast(); break;
                case 'toggleMode':
                    setMode((m) => m === 'basic' ? 'scientific' : 'basic');
                    break;
                case 'toggleDeg': setIsDeg((d) => !d); break;
                case 'nPr': setModal('nPr'); break;
                case 'nCr': setModal('nCr'); break;
                case 'stats-mean': setStatOp('mean'); setModal('stats'); break;
                case 'stats-std': setStatOp('std'); setModal('stats'); break;
                case 'stats-med': setStatOp('median'); setModal('stats'); break;
                case 'matrix': setShowMatrix(true); break;
            }
            return;
        }
        if (key.insert) {
            if (justEvaluated && /[0-9(]/.test(key.insert[0])) {
                setExpression(key.insert);
                updatePreview(key.insert);
                setJustEvaluated(false);
                return;
            }
            insert(key.insert);
        }
    }, [clear, equals, deleteLast, insert, justEvaluated]);

    // ── nPr / nCr submit ────────────────────────────────────────────────────────
    const handleCombSubmit = (values: Record<string, string>) => {
        setModal('none');
        try {
            const n = parseFloat(values.n);
            const r = parseFloat(values.r);
            if (isNaN(n) || isNaN(r)) throw new Error('Enter valid numbers');
            const val = modal === 'nPr' ? nPr(n, r) : nCr(n, r);
            const label = modal === 'nPr' ? `P(${n},${r})` : `C(${n},${r})`;
            const formatted = formatResult(val);
            setHistory((h) => [`${label} = ${formatted}`, ...h.slice(0, 49)]);
            setResult(formatted);
            setExpression(formatted);
            setJustEvaluated(true);
            setIsError(false);
            setPreview('');
        } catch (e: any) {
            setResult(e.message ?? 'Error');
            setIsError(true);
            setJustEvaluated(true);
        }
    };

    // ── Stats submit ─────────────────────────────────────────────────────────────
    const handleStatsSubmit = (values: Record<string, string>) => {
        setModal('none');
        try {
            const data = parseNumberList(values.data);
            let val: number;
            let label: string;
            switch (statOp) {
                case 'mean': val = mean(data); label = 'Mean'; break;
                case 'std': val = stdDev(data); label = 'StdDev'; break;
                case 'median': val = median(data); label = 'Median'; break;
            }
            const formatted = formatResult(val);
            setHistory((h) => [`${label}(${values.data}) = ${formatted}`, ...h.slice(0, 49)]);
            setResult(formatted);
            setExpression(formatted);
            setJustEvaluated(true);
            setIsError(false);
            setPreview('');
        } catch (e: any) {
            setResult(e.message ?? 'Error');
            setIsError(true);
            setJustEvaluated(true);
        }
    };

    // ── Matrix result ────────────────────────────────────────────────────────────
    const handleMatrixResult = (res: string) => {
        setResult(res);
        setExpression('');
        setJustEvaluated(true);
        setIsError(false);
        setPreview('');
    };

    const rows = mode === 'basic' ? BASIC_ROWS : SCIENTIFIC_ROWS;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Calculator</Text>
                <View style={styles.headerRight}>
                    {mode === 'scientific' && (
                        <Text style={styles.degBadge}>{isDeg ? 'DEG' : 'RAD'}</Text>
                    )}
                    <Pressable onPress={() => setShowHistory((s) => !s)}>
                        <Text style={styles.historyIcon}>⏱</Text>
                    </Pressable>
                    <Pressable onPress={() => setMode((m) => m === 'basic' ? 'scientific' : 'basic')}>
                        <Text style={styles.modeToggle}>{mode === 'basic' ? 'SCI' : 'BASIC'}</Text>
                    </Pressable>
                </View>
            </View>

            {/* History panel */}
            {showHistory && (
                <View style={styles.historyPanel}>
                    <ScrollView>
                        {history.length === 0 && (
                            <Text style={styles.historyEmpty}>No history yet</Text>
                        )}
                        {history.map((entry, i) => (
                            <Pressable
                                key={i}
                                onPress={() => {
                                    const parts = entry.split(' = ');
                                    if (parts[1]) {
                                        setExpression(parts[1]);
                                        setResult(parts[1]);
                                        updatePreview(parts[1]);
                                        setShowHistory(false);
                                    }
                                }}
                            >
                                <Text style={styles.historyEntry}>{entry}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                    <Pressable onPress={() => setHistory([])}>
                        <Text style={styles.clearHistory}>Clear History</Text>
                    </Pressable>
                </View>
            )}

            {/* Display */}
            <View style={styles.display}>
                <Display
                    expression={expression}
                    preview={preview}
                    result={result}
                    isError={isError}
                    justEvaluated={justEvaluated}
                />
            </View>

            {/* Keypad */}
            <View style={styles.keypad}>
                <Keypad rows={rows} onKey={handleKey} />
            </View>

            {/* nPr / nCr modal */}
            <InputModal
                visible={modal === 'nPr' || modal === 'nCr'}
                title={modal === 'nPr' ? 'Permutation (nPr)' : 'Combination (nCr)'}
                description={
                    modal === 'nPr'
                        ? 'Number of ways to arrange r items from n items.'
                        : 'Number of ways to choose r items from n items.'
                }
                fields={[
                    { key: 'n', label: 'n (total items)', placeholder: 'e.g. 5' },
                    { key: 'r', label: 'r (chosen items)', placeholder: 'e.g. 2' },
                ]}
                onSubmit={handleCombSubmit}
                onCancel={() => setModal('none')}
            />

            {/* Stats modal */}
            <InputModal
                visible={modal === 'stats'}
                title={
                    statOp === 'mean' ? 'Mean (x̄)' :
                        statOp === 'std' ? 'Standard Deviation (σ)' :
                            'Median'
                }
                description="Enter comma-separated numbers e.g. 10, 20, 30, 40"
                fields={[
                    {
                        key: 'data',
                        label: 'Data values',
                        placeholder: '10, 20, 30',
                        keyboardType: 'default',
                    },
                ]}
                onSubmit={handleStatsSubmit}
                onCancel={() => setModal('none')}
            />

            {/* Matrix modal */}
            <MatrixModal
                visible={showMatrix}
                onClose={() => setShowMatrix(false)}
                onResult={handleMatrixResult}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.xs,
    },
    headerTitle: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    degBadge: {
        color: theme.colors.accent,
        fontSize: 12,
        fontWeight: '700',
        borderWidth: 1,
        borderColor: theme.colors.accent,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    historyIcon: {
        fontSize: 20,
        color: theme.colors.textSecondary,
    },
    modeToggle: {
        color: theme.colors.accent,
        fontSize: 13,
        fontWeight: '700',
        borderWidth: 1,
        borderColor: theme.colors.accent,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    historyPanel: {
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
        maxHeight: 180,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    historyEmpty: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        paddingVertical: theme.spacing.sm,
    },
    historyEntry: {
        color: theme.colors.textPrimary,
        fontSize: 14,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
    },
    clearHistory: {
        color: theme.colors.btnClear,
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
        paddingTop: theme.spacing.sm,
    },
    display: {
        flex: 2,
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
    },
    keypad: {
        flex: 3,
        padding: theme.spacing.xs,
    },
});