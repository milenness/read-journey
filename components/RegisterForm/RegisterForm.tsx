"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { LuEye, LuEyeOff } from "react-icons/lu";

import { registerUser, SignUpRequest } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import css from "./RegisterForm.module.css";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(7, "Password must be at least 7 characters")
    .required("Password is required"),
});

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();

  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setUser({ name: data.name, email: data.email });
      router.push("/recommended");
    },
  });

  const serverError = mutation.isError
    ? (axios.isAxiosError(mutation.error) &&
        mutation.error.response?.data?.error) ||
      "Щось пішло не так"
    : null;

  return (
    <Formik<SignUpRequest>
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={schema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      {({ touched, errors }) => (
        <Form className={css.formContainer}>
          {/* Поле Name */}
            <div
              className={`${css.inputWrapper} ${touched.name && errors.name ? css.inputWrapperError : ""}`}
            >
              <label htmlFor={nameId} className={css.label}>
                Name:
              </label>
              <Field
                id={nameId}
                name="name"
                type="text"
                placeholder="Ilona Ratushniak"
                className={css.input}
            />
            <ErrorMessage
              name="name"
              component="span"
              className={css.errorText}
            />
            </div>

          {/* Поле Mail */}
          <div>
            <div
              className={`${css.inputWrapper} ${touched.email && errors.email ? css.inputWrapperError : ""}`}
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
            </div>
            <ErrorMessage
              name="email"
              component="span"
              className={css.errorText}
            />
          </div>

          {/* Поле Password */}
          <div>
            <div
              className={`${css.inputWrapper} ${touched.password && errors.password ? css.inputWrapperError : ""}`}
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
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="span"
              className={css.errorText}
            />
          </div>

          <div className={css.buttonsWrapper}>
            <button
              type="submit"
              disabled={mutation.isPending}
              className={css.submitBtn}
            >
              {mutation.isPending ? "Loading..." : "Registration"}
            </button>
  
            {serverError && <p className={css.errorText}>{serverError}</p>}
  
            <div className="linkWrapper">
              <Link href="/login">Already have an account?</Link>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
