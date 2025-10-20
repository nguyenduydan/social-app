import { SignupForm } from '@/components/auth/signup-form';

const Signup = () => {

    return (
        <div className="flex min-h-svh bg-gradient-green flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0">
            <div className="w-full max-w-sm md:max-w-6xl">
                <SignupForm />
            </div>
        </div>
    );
};

export default Signup;
