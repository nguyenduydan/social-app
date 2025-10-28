import { LoginForm } from '@/components/Auth/login-form';

const Login = () => {


    return (
        <div className="flex min-h-svh flex-col bg-gradient-green items-center justify-center p-6 md:p-10 absolute inset-0 z-0"
        >
            <div className="w-full max-w-sm md:max-w-5xl">
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
