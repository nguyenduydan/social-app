import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "./ui/spinner";
import { useAuthStore } from "@/store/useAuthStore";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const ResetPassword = ({ onClose }) => {
    const {
        step,
        formData,
        setFormData,
        forgotPassword,
        verifyResetCode,
        resetPassword,
        isLoading,
        cooldown
    } = useAuthStore();

    const handleResetPassword = async () => {
        await resetPassword();
        if (onClose) onClose(); // 👈 tắt dialog khi thành công
    };

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription>
                    {step === 1 && 'Enter your email to receive a reset code'}
                    {step === 2 && 'Enter the 6-digit code sent to your email'}
                    {step === 3 && 'Enter your new password'}
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                {step === 1 && (
                    <div className="space-y-4">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ email: e.target.value })}
                            disabled={isLoading}
                        />
                        <Button onClick={forgotPassword} disabled={isLoading} className="w-full cursor-pointer">
                            {isLoading ? <Spinner /> : "Send Reset Code"}
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        {/* Input OTP */}
                        <div className="w-full flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={formData.code}
                                onChange={(value) => setFormData({ code: value })}
                                disabled={isLoading}
                                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            >
                                <InputOTPGroup className="gap-3 justify-center [&>div]:size-12 [&>div]:text-xl [&>div]:rounded-md [&>div]:border-2" >
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>

                        </div>

                        {/* Cooldown resend */}
                        {cooldown > 0 ? (
                            <p className="text-sm text-gray-500 text-center">
                                You can resend the code in {cooldown}s
                            </p>
                        ) : (
                            <Button
                                onClick={forgotPassword}
                                variant="outline"
                                className="w-full cursor-pointer"
                                disabled={isLoading}
                            >
                                Resend Code
                            </Button>
                        )}

                        {/* Verify button */}
                        <Button
                            onClick={verifyResetCode}
                            disabled={isLoading || formData.code.length !== 6}
                            className="w-full cursor-pointer"
                        >
                            {isLoading ? <Spinner /> : "Verify Code"}
                        </Button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <Label>New Password</Label>
                        <Input
                            type="password"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ newPassword: e.target.value })}
                        />
                        <Label>Confirm Password</Label>
                        <Input
                            type="password"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ confirmPassword: e.target.value })}
                        />
                        <Button onClick={handleResetPassword} disabled={isLoading} className="w-full cursor-pointer">
                            {isLoading ? <Spinner /> : "Reset Password"}
                        </Button>
                    </div>
                )}
            </div>
        </DialogContent>
    );
};

export default ResetPassword;
