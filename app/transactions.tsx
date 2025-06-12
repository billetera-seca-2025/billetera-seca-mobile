import { useRouter } from 'expo-router';
import { TransactionsScreen } from '../components/transactions/TransactionsScreen';

export default function Transactions() {
  const router = useRouter();

  return (
    <TransactionsScreen
      onCancel={() => {
        router.back();
      }}
    />
  );
} 