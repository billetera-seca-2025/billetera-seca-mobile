import { useRouter } from 'expo-router';
import { RegisterScreen } from '../components/auth/RegisterScreen';
import { authService } from '../utils/authService';

export default function Register() {
  const router = useRouter();

  return (
    <RegisterScreen
      onRegister={async (email, password) => {
        await authService.register(email, password).then((authenticated) => {
          if (authenticated) {
            router.replace('/home');
          } else {
            throw new Error('No se pudo crear la cuenta');
          }
        });
      }}
      onLogin={() => {
        router.push('/');
      }}
    />
  );
} 