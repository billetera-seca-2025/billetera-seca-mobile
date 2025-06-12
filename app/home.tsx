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
        // TODO: Implementar
      }}
      onDebin={() => {
        // TODO: Implementar
      }}
      onTransactions={() => {
        // TODO: Implementar
      }}
      onLogout={() => {
        router.replace('/');
      }}
    />
  );
} 