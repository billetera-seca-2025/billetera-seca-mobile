import {Ionicons} from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from '../../constants/theme';
import {TransactionDTO} from '../../utils/apiService';
import {authService} from '../../utils/authService';
import {ScreenLayout} from '../common/ScreenLayout';

interface TransactionsScreenProps {
    onCancel: () => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({onCancel}) => {
    const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const data = await authService.getTransactions();
            setTransactions(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las transacciones');
        } finally {
            setLoading(false);
        }
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'INCOME':
                return 'arrow-down-circle';
            case 'OUTCOME':
                return 'arrow-up-circle';
            default:
                return 'swap-horizontal';
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'INCOME':
                return theme.colors.success;
            case 'OUTCOME':
                return theme.colors.error;
            default:
                return theme.colors.primary;
        }
    };

    const renderTransaction = ({item, index}: { item: TransactionDTO, index: number }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionIconContainer}>
                <Ionicons
                    name={getTransactionIcon(item.type)}
                    size={32}
                    color={getTransactionColor(item.type)}
                />
            </View>
            <View style={styles.transactionInfo}>
                <Text
                    testID={`transaction-type-${index}`}
                    accessibilityLabel={`transaction-type-${index}`}
                    style={styles.transactionType}
                >
                    {item.type === 'INCOME' ? 'Ingreso' : 'Egreso'}
                </Text>
                <Text style={styles.transactionDate}>
                    {new Date(item.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
                <Text
                    testID={`transaction-bank-${index}`}
                    accessibilityLabel={`transaction-bank-${index}`}
                    style={styles.transactionBank}>{item.relatedBankName || 'Transferencia'}</Text>
            </View>
            <Text
                testID={`transaction-amount-${index}`}
                accessibilityLabel={`transaction-amount-${index}`}
                style={[
                    styles.transactionAmount,
                    {color: getTransactionColor(item.type)},
                ]}
            >
                {item.type === 'INCOME' ? '+' : '-'}${item.amount.toLocaleString('es-AR')}
            </Text>
        </View>
    );

    return (
        <ScreenLayout>
            <View style={styles.container}>
                <TouchableOpacity
                    testID="back-button"
                    accessibilityLabel="back-button"
                    style={styles.backButton} onPress={onCancel}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text}/>
                </TouchableOpacity>

                <Text
                    testID="transactions-title"
                    accessibilityLabel="transactions-title"
                    style={styles.title}>Transacciones</Text>
                <Text style={styles.subtitle}>Historial de movimientos</Text>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Cargando transacciones...</Text>
                    </View>
                ) : transactions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={48} color={theme.colors.textSecondary}/>
                        <Text
                            testID="empty-transactions"
                            accessibilityLabel="empty-transactions"
                            style={styles.emptyText}>No hay transacciones para mostrar</Text>
                    </View>
                ) : (
                    <FlatList
                        data={transactions}
                        renderItem={(item) => renderTransaction({item: item.item, index: item.index})}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    backButton: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: theme.typography.sizes.xxl,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xl,
    },
    listContainer: {
        paddingVertical: theme.spacing.sm,
        marginHorizontal: theme.spacing.xs,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.sm,
        ...theme.shadows.small,
    },
    transactionIconContainer: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionType: {
        fontSize: theme.typography.sizes.md,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    transactionDate: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    transactionBank: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textSecondary,
    },
    transactionAmount: {
        fontSize: theme.typography.sizes.md,
        fontWeight: 'bold',
        marginLeft: theme.spacing.md,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    emptyText: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
}); 