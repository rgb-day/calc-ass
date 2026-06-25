import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { theme } from '../theme';
import { KeyDef } from '../keyLayouts';

interface CalcButtonProps {
    keyDef: KeyDef;
    onPress: (key: KeyDef) => void;
    flex?: number;
}

export default function CalcButton({ keyDef, onPress, flex = 1 }: CalcButtonProps) {
    const containerStyle = getContainerStyle(keyDef.color);
    const textStyle = getTextStyle(keyDef.color);

    return (
        <Pressable
            onPress={() => onPress(keyDef)}
            style={({ pressed }) => [
                styles.btn,
                containerStyle,
                { flex },
                pressed && styles.pressed,
            ]}
        >
            <Text
                style={[
                    styles.label,
                    textStyle,
                    keyDef.small && styles.labelSmall,
                ]}
                adjustsFontSizeToFit
                numberOfLines={1}
            >
                {keyDef.label}
            </Text>
        </Pressable>
    );
}

function getContainerStyle(color?: KeyDef['color']): ViewStyle {
    switch (color) {
        case 'operator': return { backgroundColor: theme.colors.btnOperator };
        case 'equals': return { backgroundColor: theme.colors.btnEquals };
        case 'function': return { backgroundColor: theme.colors.btnFunction };
        case 'clear': return { backgroundColor: theme.colors.btnClear };
        case 'special': return { backgroundColor: theme.colors.btnSpecial };
        default: return { backgroundColor: theme.colors.btnNumber };
    }
}

function getTextStyle(color?: KeyDef['color']): TextStyle {
    switch (color) {
        case 'equals':
            return { color: theme.colors.background, fontWeight: '800' };
        case 'operator':
            return { color: '#FFFFFF', fontWeight: '700' };
        case 'clear':
            return { color: '#FFFFFF', fontWeight: '700' };
        default:
            return { color: theme.colors.textPrimary };
    }
}

const styles = StyleSheet.create({
    btn: {
        margin: 4,
        borderRadius: theme.radius.btn,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    pressed: {
        opacity: 0.65,
        transform: [{ scale: 0.96 }],
    },
    label: {
        fontSize: theme.fontSize.btnLabel,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    labelSmall: {
        fontSize: theme.fontSize.btnLabelSm,
    },
});