import React from 'react'
import { Login } from '../components/auth/Login'
import { Helmet } from "react-helmet";
import student_login_keywords from '../seo/login/student_login';


export const LoginStudent = () => {
  return (
    <div>
      <Helmet>
        <title>Login as Student</title>
        <meta type="description" content="Register as a Student for exploring new way of education" />
        <meta name="keywords" content={student_login_keywords} />
      </Helmet>
        <Login formFor="student" />
    </div>
  )
}
