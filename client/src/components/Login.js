import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

const Login = ({ login, setErrors }) => {

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setErrors(null);
    }
  }, [])

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username"),
    password: yup.string().required("Must enter a password")
  })

  const formik = useFormik({
    initialValues: {
      "username": "",
      "password": ""
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/login", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values, null, 2)
      })
        .then(resp => {
          if(resp.status !== 200) {
            resp.json().then(data => setErrors(data.error))
          }
          else {
            resp.json().then(data => {
              login(data)
              navigate("/users")
            })
          }
        })
    }
  })

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="username">Username: </label>
          <input type="text" name="username" id="username" value={formik.values.username} onChange={formik.handleChange} />
          <p style={{color: "red"}}> {formik.errors.username}</p>
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input type="password" name="password" id="password" value={formik.values.password} onChange={formik.handleChange} />
          <p style={{color: "red"}}> {formik.errors.password}</p>
        </div>
        <input type="submit" value="Login" />
      </form>
    </div>
  )
}

export default Login