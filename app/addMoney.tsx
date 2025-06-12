import { useRouter } from 'expo-router';
import { AddMoneyScreen } from '../components/transactions/AddMoneyScreen';

export default function AddMoney() {
  const router = useRouter();

  return (
    <AddMoneyScreen
      onSuccess={() => {
        router.replace('/home');
      }}
      onCancel={() => {
        router.back();
      }}
    />
  );
} 