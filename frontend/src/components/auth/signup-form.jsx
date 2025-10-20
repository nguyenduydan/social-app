// import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import signupImg from "@/assets/signup.png";
import logo from "@/assets/logo.png";
import { Spinner } from "../ui/spinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";

const signUpSchema = z.object({
  firstName: z.string().min(1, 'Tên bắt buộc phải có'),
  lastName: z.string().min(1, 'Họ bắt buộc phải có'),
  email: z.email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export function SignupForm({ className, ...props }) {
  const navigate = useNavigate();
  const { signUp, loginWithGoogle } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const { firstName, lastName, email, password } = data;
    //Call BE
    await signUp(firstName, lastName, email, password);

    navigate("/signin");
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border backdrop-blur-xl shadow-2xl shadow-emerald-500/20">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-3">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <img src={logo} className="h-10 w-10 dark:brightness-150" alt="Social Logo" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  Tạo tài khoản DIFA
                </h1>
                <p className="text-muted-foreground text-sm">
                  Chào mừng! Hãy đăng ký để bắt đầu
                </p>
              </div>

              {/* Họ và tên */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="lastName" className="text-secondary-foreground font-bold">
                    Họ
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Nguyễn Văn"
                      {...register("lastName")}
                      className="px-5 border-border text-secondary-foreground placeholder:text-secondary-foreground/30 focus:border-emerald-800 focus:ring-emerald-800"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive pt-1 pl-1 italic">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="firstName" className="text-secondary-foreground font-bold">
                    Tên
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Nam"
                      {...register("firstName")}
                      className="px-5 border-border text-secondary-foreground placeholder:text-secondary-foreground/30 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive pt-1 pl-1 italic">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </Field>
              </FieldGroup>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email" className="text-secondary-foreground font-bold">
                  Email
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className="px-5 border-border text-secondary-foreground  placeholder:text-secondary-foreground/30 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive pt-1 pl-1 italic">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password" className="text-secondary-foreground font-bold">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className="px-5  border-border text-secondary-foreground placeholder:text-secondary-foreground/30 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive pt-1 pl-1 italic">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </Field>

              {/* Submit Button */}
              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-lg cursor-pointer transition-all ease-in-out duration-100 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-5 rounded-xl border-green-800 border-b-[6px] hover:brightness-130 active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                >
                  {isSubmitting ? <Spinner /> : "Tạo tài khoản mới"}
                </Button>
              </Field>

              {/* OR separator */}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Hoặc
              </FieldSeparator>

              {/* Google Button */}
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={loginWithGoogle}
                  className=" cursor-pointer w-full py-4 rounded-xl border-border text-secondary-foreground hover:bg-emerald-400 hover:border-emerald-400 transition-all hover:text-secondary-foreground font-bold"
                >
                  <svg
                    className="mr-2 h-4 w-4 text-red-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Đăng ký với Google
                </Button>
              </Field>

              {/* Login link */}
              <FieldDescription className="text-center text-secondary-foreground">
                Bạn đã có tài khoản?{" "}
                <Link
                  to="/signin"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Đăng nhập
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Right side image */}
          <div className="relative hidden md:block bg-muted">
            <img
              src={signupImg}
              alt="signup"
              className="absolute inset-0 top-1/2 -translate-y-1/2 object-cover dark:brightness-110"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-secondary">
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <a href="#" className="text-primary-foreground">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#" className="text-primary-foreground">
          Chính sách bảo mật
        </a> của chúng tôi.
      </FieldDescription>
    </div>
  );
}
