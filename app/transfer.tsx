import { useRouter } from 'expo-router';
import { TransferScreen } from '../components/transactions/TransferScreen';

export default function Transfer() {
  const router = useRouter();

  return (
    <TransferScreen
      onSuccess={() => {
        router.replace('/home');
      }}
      onCancel={() => {
        router.back();
      }}
    />
  );
} 