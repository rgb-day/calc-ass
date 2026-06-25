import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { theme } from '../theme';

interface DisplayProps {
    expression: string;
    preview: string;
    result: string;
    isError: boolean;
    justEvaluated: boolean;
}

export default function Display({
    expression,
    preview,
    result,
    isError,
    justEvaluated,
}: DisplayProps) {
    return (
        <View style={styles.container}>
            {/* Expression line */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.expressionContainer}
            >
                <Text style={styles.expression} numberOfLines={1}>
                    {expression || ' '}
                </Text>
            </ScrollView>

            {/* Live preview */}
            {preview !== '' && !justEvaluated && (
                <Text style={styles.preview} numberOfLines={1}>
                    = {preview}
                </Text>
            )}

            {/* Main result */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.resultContainer}
            >
                <Text
                    style={[
                        styles.result,
                        isError && styles.resultError,
                        justEvaluated && styles.resultFinal,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    {result}
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
    },
    expressionContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    expression: {
        fontSize: theme.fontSize.expression,
        color: theme.colors.textSecondary,
        textAlign: 'right',
        letterSpacing: 0.5,
    },
    preview: {
        fontSize: theme.fontSize.preview,
        color: theme.colors.accent,
        textAlign: 'right',
        opacity: 0.7,
        marginTop: theme.spacing.xs,
    },
    resultContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    result: {
        fontSize: theme.fontSize.display,
        color: theme.colors.textPrimary,
        textAlign: 'right',
        fontWeight: '300',
        letterSpacing: -1,
        marginTop: theme.spacing.xs,
    },
    resultError: {
        color: theme.colors.btnClear,
        fontSize: 36,
    },
    resultFinal: {
        color: theme.colors.textResult,
        fontWeight: '400',
    },
});