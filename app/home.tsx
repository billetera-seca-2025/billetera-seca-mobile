import { useRouter } from 'expo-router';
import { HomeScreen } from '../components/home/HomeScreen';

export default function Home() {
  const router = useRouter();

  return (
    <HomeScreen
      onTransfer={() => {
        router.push('/transfer');
      }}
      onAddMoney={() => {
        router.push('/addMoney');
      }}
      onTransactions={() => {
        router.push('/transactions');
      }}
      onLogout={() => {
        router.replace('/');
      }}
    />
  );
} 