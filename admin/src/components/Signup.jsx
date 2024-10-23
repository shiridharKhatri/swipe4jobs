import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ButtonLoader from "./ButtonLoader";
export default function Signup(props) {
  const url = import.meta.env.VITE_HOST;
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    role: "admin",
  });
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const valueOnChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const rolesOnChange = (e) => {
    setValues((prev) => ({ ...prev, role: e.target.id }));
  };

  const signup = (e) => {
    e.preventDefault();

    if (values.name === "") {
      return setError((prev) => ({ ...prev, name: "Name must not be empty" }));
    } else {
      setError((prev) => ({ ...prev, name: "" }));
    }
    if (values.email === "") {
      return setError((prev) => ({
        ...prev,
        email: "Email must not be empty",
      }));
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(values.email)) {
        return setError((prev) => ({
          ...prev,
          email: "Please enter a valid email address.",
        }));
      } else {
        setError((prev) => ({ ...prev, email: "" }));
      }
      setError((prev) => ({ ...prev, email: "" }));
    }
    if (values.password === "") {
      return setError((prev) => ({
        ...prev,
        password: "Password must not be empty",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        password: "",
      }));
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",/?]).{8,}$/;
      if (!passwordRegex.test(values.password)) {
        setError((prev) => ({
          ...prev,
          password:
            "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          password: "",
        }));
        if (values.password !== values.rePassword) {
          return setError((prev) => ({
            ...prev,
            rePassword: "Password and confirm password not matching",
          }));
        } else {
          setIsButtonLoading(true);
          setError((prev) => ({ ...prev, rePassword: "" }));
          axios
            .post(
              `${url}/auth/admin/new/create`,
              {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role,
              },
              {
                headers: {
                  "auth-token": Cookies.get("admin-token"),
                },
              }
            )
            .then((res) => {
              if (res.data.success === true) {
                setIsButtonLoading(false);
                window.location.reload();
              }
            })
            .catch((error) => {
              console.log(error);
              if (
                error.status === 409 &&
                error.response.data.type === "email"
              ) {
                setIsButtonLoading(false);
                setError((prev) => ({
                  ...prev,
                  email: error.response.data.message,
                }));
              } else {
                setIsButtonLoading(false);
                setError((prev) => ({
                  ...prev,
                  email: "",
                }));
                if (error.status === 401) {
                  props.signupAction(false);
                  props.errorPopupRef.current.style.top = "3rem";
                  props.errorPopupRef.current.innerHTML = `
                <div class="error">
                <div class="error__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    viewBox="0 0 24 24"
                    height="24"
                    fill="none"
                  >
                    <path
                      fill="#393a37"
                      d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"
                    ></path>
                  </svg>
                </div>
                <div class="error__title">${error.response.data.message}</div>
              </div>
                `;
                }
                setTimeout(() => {
                  props.errorPopupRef.current.style.top = "-7rem";
                }, 3000);
              }
            });
        }
      }
    }
  };

  return (
    <section className="signup">
      <div className="card">
        <div className="title">Create new admin</div>
        <form action="">
          <input
            type="text"
            name="name"
            onChange={valueOnChange}
            placeholder="Enter name"
          />
          <div className="error">{error.name}</div>
          <input
            type="email"
            name="email"
            onChange={valueOnChange}
            placeholder="example@gmail.com"
          />
          <div className="error">{error.email}</div>
          <input
            type="password"
            name="password"
            onChange={valueOnChange}
            id="password"
            placeholder="Enter password"
          />
          <div className="error">{error.password}</div>
          <input
            type="password"
            name="rePassword"
            onChange={valueOnChange}
            id="re-password"
            placeholder="Re-enter your password"
          />
          <div className="error">{error.rePassword}</div>
          <div className="role">
            <div className="radio-buttons-container">
              <div className="radio-button">
                <input
                  name="radio-group"
                  id="admin"
                  className="radio-button__input"
                  type="radio"
                  onChange={rolesOnChange}
                  defaultChecked
                />
                <label htmlFor="admin" className="radio-button__label">
                  <span className="radio-button__custom"></span>
                  Admin
                </label>
              </div>
              <div className="radio-button">
                <input
                  name="radio-group"
                  id="modiator"
                  className="radio-button__input"
                  type="radio"
                  onChange={rolesOnChange}
                />
                <label htmlFor="modiator" className="radio-button__label">
                  <span className="radio-button__custom"></span>
                  Modiator
                </label>
              </div>
              <div className="radio-button">
                <input
                  name="radio-group"
                  id="editor"
                  className="radio-button__input"
                  type="radio"
                  onChange={rolesOnChange}
                />
                <label htmlFor="editor" className="radio-button__label">
                  <span className="radio-button__custom"></span>
                  Editor
                </label>
              </div>
            </div>
          </div>
          <div className="btns">
            <button type="button" onClick={() => props.signupAction(false)}>
              Cancel
            </button>
            <button type="submit" onClick={signup}>
              {isButtonLoading && <ButtonLoader />}
              {!isButtonLoading && "Signup"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
