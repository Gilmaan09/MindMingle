// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useAuth } from '../context/AuthContext';

// const Register = () => {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     gender: '',
//     dob: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name || !form.email || !form.password || !form.gender || !form.dob) {
//       return toast.error('Please fill in all fields');
//     }
//     if(form.name.length<4){
//       return toast.error("Cant be less than 4 characters");
//     }
//     if (form.password.length < 6) {
//       return toast.error('Password must be at least 6 characters');
//     }
//     if (form.password !== form.confirmPassword) {
//       return toast.error('Passwords do not match');
//     }
//     setLoading(true);
//     try {
//       await register(form.name, form.email, form.password, form.gender, form.dob);
//       toast.success('Account created! Welcome to Mindmingle 🌱');
//       navigate('/login');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page" style={{ position: 'relative' }}>

//     {/* Close Button */}
//     <button
//       onClick={() => navigate('/')}
//       style={{
//         position: 'absolute',
//         top: '20px',
//         right: '20px',
//         background: 'transparent',
//         border: 'none',
//         fontSize: '44px',
//         cursor: 'pointer'
//       }}
//     >
//       &times;
//     </button>
//     {/* <div className="auth-page"> */}
//       <div className="auth-card">
//         <div className="auth-logo">
//           <h1>Mind<span>mingle</span></h1>
//           <p>Begin your mindfulness journey today</p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label">Full Name</label>
//             <input
//               type="text"
//               className="form-input"
//               placeholder="Your name"
//               value={form.name}
//               onChange={e => setForm({ ...form, name: e.target.value })}
//               autoComplete="name"
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">Email Address</label>
//             <input
//               type="email"
//               className="form-input"
//               placeholder="you@example.com"
//               value={form.email}
//               onChange={e => setForm({ ...form, email: e.target.value })}
//               autoComplete="email"
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Gender</label>
//             <select
//               className="form-input"
//               value={form.gender}
//               onChange={(e) => setForm({ ...form, gender: e.target.value })}
//             >
//               <option value="">Select Gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>
//           <div className='form-group'>
//           <label className='form-label'>Date Of Birth</label>
//           <input
//             type="date"
//             className="form-input"
//             value={form.dob}
//             max={new Date().toISOString().split("T")[0]}
//             onChange={(e) => setForm({ ...form, dob: e.target.value })}
//           />
//           </div>

//           <div className="form-group">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-input"
//               placeholder="Min. 6 characters"
//               value={form.password}
//               onChange={e => setForm({ ...form, password: e.target.value })}
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">Confirm Password</label>
//             <input
//               type="password"
//               className="form-input"
//               placeholder="Repeat your password"
//               value={form.confirmPassword}
//               onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
//             />
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary btn-full btn-lg"
//             disabled={loading}
//           >
//             {loading ? 'Creating account...' : 'Create Account'}
//           </button>
//         </form>

//         <p style={{
//           textAlign: 'center', marginTop: '24px',
//           fontSize: '0.9rem', color: 'var(--warm-gray)'
//         }}>
//           Already have an account?{' '}
//           <Link to="/login" style={{ color: 'var(--sage)', fontWeight: '600' }}>
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;


//   {/* <button
//       onClick={() => navigate('/')}
//       style={{
//         position: 'absolute',
//         top: '20px',
//         right: '20px',
//         background: 'transparent',
//         border: 'none',
//         fontSize: '44px',
//         cursor: 'pointer'
//       }}
//     >
//       &times;
//     </button> */}
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {

const [form, setForm] = useState({
name: '',
email: '',
password: '',
confirmPassword: '',
gender: '',
dob: ''
});

const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

const { register } = useAuth();
const navigate = useNavigate();

const handleChange = (e) => {

const { name, value } = e.target;

let errorMsg = "";

/* NAME VALIDATION (ONLY LETTERS) */
if (name === "name") {

  const nameRegex = /^[A-Za-z\s]+$/;

  if (value.trim() === "") {
    errorMsg = "Name is required";
  }
   else if(name.length<4){
    errorMsg = "Cant be less than 4 characters"
  }
  else if (!nameRegex.test(value)) {
    errorMsg = "Name should contain only letters";
  }
 

}

/* EMAIL VALIDATION */
if (name === "email") {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value.trim() === "") {
    errorMsg = "Email is required";
  }
  else if (!emailRegex.test(value)) {
    errorMsg = "Enter a valid email address";
  }

}

/* PASSWORD VALIDATION */

if (name === "password") {

  if (value.length < 6) {
    errorMsg = "Password must be at least 6 characters";
  }

}

/* CONFIRM PASSWORD */

if (name === "confirmPassword") {

  if (value !== form.password) {
    errorMsg = "Passwords do not match";
  }

}

/* GENDER */

if (name === "gender") {

  if (value === "") {
    errorMsg = "Please select gender";
  }

}

/* DOB */

if (name === "dob") {

  if (value === "") {
    errorMsg = "Date of birth is required";
  }

}

/* Update form */

setForm(prev => ({
...prev,
[name]: value
}));

/* Update errors */

setErrors(prev => ({
...prev,
[name]: errorMsg
}));

};

const handleSubmit = async (e) => {

e.preventDefault();

if (!form.name || !form.email || !form.password || !form.gender || !form.dob) {
  return toast.error('Please fill in all fields');
}

if (form.password.length < 6) {
  return toast.error('Password must be at least 6 characters');
}

if (form.password !== form.confirmPassword) {
  return toast.error('Passwords do not match');
}

setLoading(true);

try {

  await register(form.name, form.email, form.password, form.gender, form.dob);

  toast.success('Account created! Welcome to Mindmingle 🌱');

  navigate('/login');

} catch (err) {

  toast.error(err.response?.data?.message || 'Registration failed');

} finally {

  setLoading(false);

}

};

return (

<div className="auth-page" style={{ position: 'relative' }}>

<button
onClick={() => navigate('/')}
style={{
position: 'absolute',
top: '20px',
right: '20px',
background: 'transparent',
border: 'none',
fontSize: '44px',
cursor: 'pointer'
}}
>
&times;
</button>

<div className="auth-card">

<div className="auth-logo">
<h1>Mind<span>mingle</span></h1>
<p>Begin your mindfulness journey today</p>
</div>

<form onSubmit={handleSubmit}>

{/* NAME */}

<div className="form-group">

<label className="form-label">Full Name</label>

<input
name="name"
type="text"
className="form-input"
placeholder="Your name"
value={form.name}
onChange={handleChange}
/>

{errors.name && (
<p style={{color:"red",fontSize:"12px"}}>{errors.name}</p>
)}

</div>

{/* EMAIL */}

<div className="form-group">

<label className="form-label">Email Address</label>

<input
name="email"
type="email"
className="form-input"
placeholder="you@example.com"
value={form.email}
onChange={handleChange}
/>

{errors.email && (
<p style={{color:"red",fontSize:"12px"}}>{errors.email}</p>
)}

</div>

{/* GENDER */}

<div className="form-group">

<label className="form-label">Gender</label>

<select
name="gender"
className="form-input"
value={form.gender}
onChange={handleChange}
>

<option value="">Select Gender</option>
<option value="Male">Male</option>
<option value="Female">Female</option>
<option value="Other">Other</option>

</select>

{errors.gender && (
<p style={{color:"red",fontSize:"12px"}}>{errors.gender}</p>
)}

</div>

{/* DOB */}

<div className='form-group'>

<label className='form-label'>Date Of Birth</label>

<input
name="dob"
type="date"
className="form-input"
value={form.dob}
max={new Date().toISOString().split("T")[0]}
onChange={handleChange}
/>

{errors.dob && (
<p style={{color:"red",fontSize:"12px"}}>{errors.dob}</p>
)}

</div>

{/* PASSWORD */}

<div className="form-group">

<label className="form-label">Password</label>

<input
name="password"
type="password"
className="form-input"
placeholder="Min. 6 characters"
value={form.password}
onChange={handleChange}
/>

{errors.password && (
<p style={{color:"red",fontSize:"12px"}}>{errors.password}</p>
)}

</div>

{/* CONFIRM PASSWORD */}

<div className="form-group">

<label className="form-label">Confirm Password</label>

<input
name="confirmPassword"
type="password"
className="form-input"
placeholder="Repeat your password"
value={form.confirmPassword}
onChange={handleChange}
/>

{errors.confirmPassword && (
<p style={{color:"red",fontSize:"12px"}}>{errors.confirmPassword}</p>
)}

</div>

<button
type="submit"
className="btn btn-primary btn-full btn-lg"
disabled={loading}
>

{loading ? 'Creating account...' : 'Create Account'}

</button>

</form>

<p style={{
textAlign: 'center',
marginTop: '24px',
fontSize: '0.9rem',
color: 'var(--warm-gray)'
}}>

Already have an account?{' '}

<Link to="/login" style={{ color: 'var(--sage)', fontWeight: '600' }}>
Sign in
</Link>

</p>

</div>

</div>

);

};

export default Register;
