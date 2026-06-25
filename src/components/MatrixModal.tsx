import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { theme } from '../theme';
import {
    Matrix,
    matAdd,
    matSub,
    matMul,
    matDet,
    matTranspose,
    matFormatResult,
} from '../mathEngine';

type MatrixSize = 2 | 3 | 4;
type Operation = 'add' | 'sub' | 'mul' | 'det' | 'transpose';

interface MatrixModalProps {
    visible: boolean;
    onClose: () => void;
    onResult: (result: string) => void;
}

function emptyMatrix(size: MatrixSize): string[][] {
    return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => '')
    );
}

function parseMatrix(raw: string[][]): Matrix {
    return raw.map((row) =>
        row.map((val) => {
            const n = parseFloat(val);
            if (isNaN(n)) throw new Error('All matrix cells must be filled with numbers');
            return n;
        })
    );
}

export default function MatrixModal({
    visible,
    onClose,
    onResult,
}: MatrixModalProps) {
    const [size, setSize] = useState<MatrixSize>(2);
    const [matA, setMatA] = useState<string[][]>(emptyMatrix(2));
    const [matB, setMatB] = useState<string[][]>(emptyMatrix(2));
    const [operation, setOperation] = useState<Operation>('add');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const changeSize = (s: MatrixSize) => {
        setSize(s);
        setMatA(emptyMatrix(s));
        setMatB(emptyMatrix(s));
        setResult('');
        setError('');
    };

    const updateCell = (
        mat: string[][],
        setMat: (m: string[][]) => void,
        row: number,
        col: number,
        val: string
    ) => {
        const copy = mat.map((r) => [...r]);
        copy[row][col] = val;
        setMat(copy);
    };

    const compute = () => {
        setError('');
        setResult('');
        try {
            const A = parseMatrix(matA);

            if (operation === 'det') {
                const d = matDet(A);
                setResult(`det(A) = ${parseFloat(d.toPrecision(8))}`);
                return;
            }

            if (operation === 'transpose') {
                const T = matTranspose(A);
                setResult(`A^T =\n${matFormatResult(T)}`);
                return;
            }

            const B = parseMatrix(matB);
            let R: Matrix;
            switch (operation) {
                case 'add': R = matAdd(A, B); break;
                case 'sub': R = matSub(A, B); break;
                case 'mul': R = matMul(A, B); break;
                default: return;
            }
            const label = operation === 'add' ? 'A+B' : operation === 'sub' ? 'A-B' : 'A×B';
            setResult(`${label} =\n${matFormatResult(R)}`);
        } catch (e: any) {
            setError(e.message ?? 'Error');
        }
    };

    const sendResult = () => {
        if (result) {
            onResult(result);
            onClose();
        }
    };

    const needsB = operation !== 'det' && operation !== 'transpose';

    const renderMatrix = (
        mat: string[][],
        setMat: (m: string[][]) => void,
        label: string
    ) => (
        <View style={styles.matrixBlock}>
            <Text style={styles.matLabel}>Matrix {label}</Text>
            {mat.map((row, i) => (
                <View key={i} style={styles.matRow}>
                    {row.map((val, j) => (
                        <TextInput
                            key={j}
                            style={styles.cell}
                            value={val}
                            onChangeText={(t) => updateCell(mat, setMat, i, j, t)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={theme.colors.textSecondary}
                            selectionColor={theme.colors.accent}
                        />
                    ))}
                </View>
            ))}
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Matrix Calculator</Text>

                    {/* Size selector */}
                    <View style={styles.row}>
                        {([2, 3, 4] as MatrixSize[]).map((s) => (
                            <Pressable
                                key={s}
                                style={[styles.sizeBtn, size === s && styles.sizeBtnActive]}
                                onPress={() => changeSize(s)}
                            >
                                <Text style={[styles.sizeBtnText, size === s && styles.sizeBtnTextActive]}>
                                    {s}×{s}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Operation selector */}
                    <View style={styles.row}>
                        {(['add', 'sub', 'mul', 'det', 'transpose'] as Operation[]).map((op) => (
                            <Pressable
                                key={op}
                                style={[styles.opBtn, operation === op && styles.opBtnActive]}
                                onPress={() => { setOperation(op); setResult(''); setError(''); }}
                            >
                                <Text style={[styles.opBtnText, operation === op && styles.opBtnTextActive]}>
                                    {op === 'add' ? 'A+B' : op === 'sub' ? 'A-B' : op === 'mul' ? 'A×B' : op === 'det' ? 'det(A)' : 'Aᵀ'}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {renderMatrix(matA, setMatA, 'A')}
                        {needsB && renderMatrix(matB, setMatB, 'B')}

                        {/* Result */}
                        {result !== '' && (
                            <View style={styles.resultBox}>
                                <Text style={styles.resultText}>{result}</Text>
                            </View>
                        )}
                        {error !== '' && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}
                    </ScrollView>

                    {/* Action buttons */}
                    <View style={styles.row}>
                        <Pressable style={[styles.btn, styles.btnCancel]} onPress={onClose}>
                            <Text style={styles.btnCancelText}>Close</Text>
                        </Pressable>
                        <Pressable style={[styles.btn, styles.btnCompute]} onPress={compute}>
                            <Text style={styles.btnComputeText}>Compute</Text>
                        </Pressable>
                        {result !== '' && (
                            <Pressable style={[styles.btn, styles.btnSend]} onPress={sendResult}>
                                <Text style={styles.btnComputeText}>→ Calc</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: theme.spacing.lg,
        maxHeight: '90%',
        borderTopWidth: 1,
        borderColor: theme.colors.borderStrong,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.accent,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: theme.spacing.sm,
        flexWrap: 'wrap',
    },
    sizeBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: theme.radius.btn,
        backgroundColor: theme.colors.surfaceElevated,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sizeBtnActive: {
        backgroundColor: theme.colors.accent,
        borderColor: theme.colors.accent,
    },
    sizeBtnText: {
        color: theme.colors.textSecondary,
        fontWeight: '700',
    },
    sizeBtnTextActive: {
        color: theme.colors.background,
    },
    opBtn: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: theme.radius.btn,
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    opBtnActive: {
        backgroundColor: theme.colors.accentOrange,
        borderColor: theme.colors.accentOrange,
    },
    opBtnText: {
        color: theme.colors.textSecondary,
        fontWeight: '600',
        fontSize: 12,
    },
    opBtnTextActive: {
        color: '#fff',
    },
    matrixBlock: {
        marginBottom: theme.spacing.md,
    },
    matLabel: {
        color: theme.colors.textSecondary,
        fontWeight: '700',
        marginBottom: 6,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    matRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 6,
    },
    cell: {
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.radius.btn,
        borderWidth: 1,
        borderColor: theme.colors.border,
        color: theme.colors.textPrimary,
        fontSize: 20,
        fontWeight: '400',
        textAlign: 'center',
        width: 56,
        height: 48,
        margin: 0,
        paddingHorizontal: 4,
    },
    resultBox: {
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.radius.btn,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    resultText: {
        color: theme.colors.textResult,
        fontSize: 14,
        fontFamily: 'monospace',
        textAlign: 'center',
    },
    errorText: {
        color: theme.colors.btnClear,
        fontSize: 13,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    btn: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.btn,
        alignItems: 'center',
    },
    btnCancel: {
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    btnCompute: {
        backgroundColor: theme.colors.accent,
    },
    btnSend: {
        backgroundColor: theme.colors.accentOrange,
    },
    btnCancelText: {
        color: theme.colors.textSecondary,
        fontWeight: '600',
        fontSize: 16,
    },
    btnComputeText: {
        color: theme.colors.background,
        fontWeight: '800',
        fontSize: 16,
    },
});