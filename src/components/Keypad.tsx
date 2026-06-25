import React from 'react';
import { View, StyleSheet } from 'react-native';
import CalcButton from './CalcButton';
import { KeyDef } from '../keyLayouts';

interface KeypadProps {
    rows: KeyDef[][];
    onKey: (key: KeyDef) => void;
}

export default function Keypad({ rows, onKey }: KeypadProps) {
    return (
        <View style={styles.container}>
            {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((keyDef, colIndex) => (
                        <CalcButton
                            key={colIndex}
                            keyDef={keyDef}
                            onPress={onKey}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
});