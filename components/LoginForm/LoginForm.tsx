"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { MdErrorOutline } from "react-icons/md";
import { RiCheckboxCircleLine } from "react-icons/ri";
import toast from "react-hot-toast";

import { loginUser, SignInRequest } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/Loader/Loader"; // 👈 Імпортуємо наш лоадер
import css from "./LoginForm.module.css";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(7, "Password must be at least 7 characters")
    .required("Password is required"),
});

export default function LoginForm() {
  const router = useRouter();

  // 👈 Дістаємо setAuth замість setUser
  const setAuth = useAuthStore((state) => state.setAuth);

  const emailId = useId();
  const passwordId = useId();

  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // 👈 Передаємо юзера ТА його токен у стор
      setAuth({ name: data.name, email: data.email }, data.token);
      router.push("/recommended");
    },
    onError: (error) => {
      const errorMessage =
        (axios.isAxiosError(error) && error.response?.data?.error) ||
        "Invalid email or password.";

      toast.error(errorMessage);
    },
  });

  return (
    <>
      {(mutation.isPending || mutation.isSuccess) && <Loader />}

      <Formik<SignInRequest>
        initialValues={{ email: "", password: "" }}
        validationSchema={schema}
        onSubmit={(values) => mutation.mutate(values)}
      >
        {({ touched, errors, values }) => {
          const isEmailError = touched.email && errors.email;
          const isEmailSuccess =
            touched.email && !errors.email && values.email.trim() !== "";

          const isPasswordError = touched.password && errors.password;
          const isPasswordSuccess =
            touched.password &&
            !errors.password &&
            values.password.trim() !== "";

          return (
            <Form className={css.formContainer}>
              <div className={css.errorWrapper}>
                <div
                  className={`${css.inputWrapper} ${
                    isEmailError
                      ? css.inputWrapperError
                      : isEmailSuccess
                        ? css.inputWrapperSuccess
                        : ""
                  }`}
                >
                  <label htmlFor={emailId} className={css.label}>
                    Mail:
                  </label>
                  <Field
                    id={emailId}
                    name="email"
                    type="email"
                    placeholder="Your@email.com"
                    className={css.input}
                  />

                  {isEmailError && (
                    <MdErrorOutline size={18} className={css.errorIcon} />
                  )}
                  {isEmailSuccess && (
                    <RiCheckboxCircleLine
                      size={18}
                      className={css.successIcon}
                    />
                  )}
                </div>

                <ErrorMessage
                  name="email"
                  component="span"
                  className={css.errorText}
                />
                {isEmailSuccess && (
                  <span className={css.successText}>Email is correct</span>
                )}
              </div>

              {/* Поле Password */}
              <div className={css.errorWrapper}>
                <div
                  className={`${css.inputWrapper} ${
                    isPasswordError
                      ? css.inputWrapperError
                      : isPasswordSuccess
                        ? css.inputWrapperSuccess
                        : ""
                  }`}
                >
                  <label htmlFor={passwordId} className={css.label}>
                    Password:
                  </label>
                  <Field
                    id={passwordId}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Yourpasswordhere"
                    className={css.input}
                  />

                  <button
                    type="button"
                    className={css.iconButton}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <LuEyeOff size={18} className={css.iconEye} />
                    ) : (
                      <LuEye size={18} className={css.iconEye} />
                    )}
                  </button>

                  {isPasswordError && (
                    <MdErrorOutline size={18} className={css.errorIcon} />
                  )}
                  {isPasswordSuccess && (
                    <RiCheckboxCircleLine
                      size={18}
                      className={css.successIcon}
                    />
                  )}
                </div>

                <ErrorMessage
                  name="password"
                  component="span"
                  className={css.errorText}
                />
                {isPasswordSuccess && (
                  <span className={css.successText}>Password is secure</span>
                )}
              </div>

              <div className={css.buttonsWrapper}>
                <button
                  type="submit"
                  disabled={mutation.isPending || mutation.isSuccess}
                  className={css.submitBtn}
                >
                  Log in
                </button>

                <Link href="/register" className={css.registerLink}>
                  Don’t have an account?
                </Link>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
