import React from "react";
import { useState } from "react";
import crossBtn from "../../assets/icons/cross.png";
import createToast from "../../utility/toast";
import { useDispatch } from "react-redux";
import { userRegister } from "../../redux/auth/authAction";
import { useNavigate } from "react-router-dom";
//date of reg
const day = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];
// month of reg
const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// years of reg
const years = Array.from(
  { length: 100 },
  (_, i) => new Date().getFullYear() - i
);

const Register = ({ setRegister }) => {
  // navigate
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // current date info
  const date = new Date();

  //from fields
  const [input, setInput] = useState({
    fname: "",
    sname: "",
    emailOrMobile: "",
    password: "",
    day: date.getDate(),
    month: month[date.getMonth()],
    year: date.getFullYear(),
    gender: "",
  });

  //validate state
  const [validate, setValidate] = useState({
    fname: false,
    sname: false,
    emailOrMobile: false,
    password: false,
  });

  //input state update
  const handleInputChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // handle input validate
  const handleInputValidate = (e) => {
    const fieldName = e.target.name;
    if (!input[fieldName]) {
      setValidate((prevState) => ({
        ...prevState,
        [fieldName]: true,
      }));
    } else {
      setValidate((prevState) => ({
        ...prevState,
        [fieldName]: false,
      }));
    }
  };

  //handle validate on focus
  const handleInputValidateFocus = (e) => {
    const fieldName = e.target.name;

    setValidate((prevState) => ({
      ...prevState,
      [fieldName]: false,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { fname, sname, emailOrMobile, gender, day, month, year, password } =
      input;
    //check validation
    if (
      !fname ||
      !sname ||
      !emailOrMobile ||
      !gender ||
      !day ||
      !month ||
      !year ||
      !password
    ) {
      createToast("All fields are required");
    } else {
      dispatch(
        userRegister(
          {
            first_name: fname,
            sur_name: sname,
            auth: emailOrMobile,
            password: password,
            gender: gender,
            birth_date: day,
            birth_month: month,
            birth_year: year,
          },
          setInput,
          e,
          setRegister,
          navigate
        )
      );
    }
  };

  return (
    <>
      <div className="blur-box">
        <div className="sign-up-card">
          <div className="sign-up-header">
            <div className="sign-up-content">
              <span>Sign Up</span>
              <span>It's quick and easy.</span>
            </div>
            <button onClick={() => setRegister(false)}>
              <img src={crossBtn} alt="" />
            </button>
          </div>
          <div className="sign-up-body">
            <form onSubmit={handleRegister}>
              <div className="reg-form reg-form-inline">
                <input
                  style={{ pa: "10px" }}
                  className={validate.fname && "error-border"}
                  onBlur={handleInputValidate}
                  onChange={handleInputChange}
                  onFocus={handleInputValidateFocus}
                  name="fname"
                  value={input.fname}
                  type="text"
                  placeholder="First Name"
                />

                <input
                  className={validate.sname && "error-border"}
                  onBlur={handleInputValidate}
                  onChange={handleInputChange}
                  onFocus={handleInputValidateFocus}
                  name="sname"
                  value={input.sname}
                  type="text"
                  placeholder="Surname"
                />
              </div>
              <div className="reg-form">
                <input
                  className={validate.emailOrMobile && "error-border"}
                  onBlur={handleInputValidate}
                  onChange={handleInputChange}
                  onFocus={handleInputValidateFocus}
                  name="emailOrMobile"
                  value={input.emailOrMobile}
                  type="text"
                  placeholder="Mobile number or email address"
                />
              </div>
              <div className="reg-form">
                <input
                  className={validate.password && "error-border"}
                  onBlur={handleInputValidate}
                  onChange={handleInputChange}
                  onFocus={handleInputValidateFocus}
                  name="password"
                  value={input.password}
                  type="password"
                  placeholder="New password"
                />
              </div>
              <div className="reg-form">
                <span>Date of birth</span>
                <div className="reg-form-select">
                  <select name="day" id="" onChange={handleInputChange}>
                    {day.map((item, index) => (
                      <option
                        selected={item === input.day ? true : false}
                        value={item}
                        key={index}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                  <select name="month" id="" onChange={handleInputChange}>
                    {month.map((item, index) => (
                      <option
                        selected={item === input.month ? true : false}
                        value={item}
                        key={index}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                  <select name="year" id="" onChange={handleInputChange}>
                    {years.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="reg-form">
                <span>Gender</span>
                <div className="reg-form-select">
                  <label>
                    Female
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Male
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Custom
                    <input
                      type="radio"
                      name="gender"
                      value="Custom"
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
              </div>

              <div className="reg-form">
                <p>
                  People who use our service may have uploaded your contact
                  information to Facebook. <a href="#">Learn more.</a>
                </p>
              </div>
              <div className="reg-form">
                <p>
                  By clicking Sign Up, you agree to our <a href="#">Terms</a>,{" "}
                  <a href="#">Privacy Policy</a> and{" "}
                  <a href="#">Cookies Policy</a>. You may receive SMS
                  notifications from us and can opt out at any time.
                </p>
              </div>

              <div className="reg-form">
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

////////////////////////////////////////////////////

// import React from "react";
// import { useRef, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { userRegister } from "../../redux/auth/authAction";
// import { regErrorFildes } from "../../utility/formValidator";
// import { setMonthShortName, setStateValues } from "../../utility/satvalus";
// import createTost from "../../utility/toast";
// import crouseBtn from "../../assets/icons/cross.png";
// import "./Register.css";

// const day = [
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
//   23, 24, 25, 26, 27, 28, 29, 30, 31,
// ];
// const month = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];
// const year = Array.from(
//   { length: 118 },
//   (_, i) => new Date().getFullYear() - i
// );

// const Register = ({ setRegister }) => {
//   // use dispatch
//   const dispatch = useDispatch();

//   // use navigate
//   const navigate = useNavigate();

//   const useref = useRef();
//   useEffect(() => {
//     useref.current.focus();
//   }, []);

//   let date = new Date();
//   const [input, setInput] = useState({
//     fname: "",
//     sname: "",
//     emailorphone: "",
//     password: "",
//     day: date.getDate(),
//     month: setMonthShortName(date.getMonth()),
//     year: date.getFullYear(),
//     gender: "",
//     gender_custom: "",
//     gender_pronoun: "",
//   });

//   // input state update
//   const handleInputChange = (e) => {
//     setStateValues(setInput, e);
//     // setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // form error alert manage
//   const [toolBorder, setToolBorder] = useState({});
//   const [toolTip, setToolTip] = useState({});
//   const [fildEdit, setFildEdit] = useState({});

//   console.log(fildEdit);
//   console.log(toolTip);

//   const tollBlurHandle = (e) => {
//     setFildEdit((prev) => ({ ...prev, [e.target.name]: true }));
//     setToolTip((prev) => ({ ...prev, [e.target.name]: false }));
//     if (e.target.value) {
//       setToolBorder((prev) => ({ ...prev, [e.target.name]: false }));
//     } else {
//       setToolBorder((prev) => ({ ...prev, [e.target.name]: true }));
//     }
//   };

//   const toolFacusHandle = (e) => {
//     setToolBorder((prev) => ({ ...prev, [e.target.name]: false }));
//     if (e.target.value) {
//       setToolTip((prev) => ({ ...prev, [e.target.name]: false }));
//     } else {
//       setToolTip((prev) => ({ ...prev, [e.target.name]: true }));
//     }
//   };

//   let yearValid = new Date().getFullYear() - 5;
//   const tollBlurHandleDate = (e) => {
//     setFildEdit((prev) => ({ ...prev, year: true }));
//     setToolTip((prev) => ({ ...prev, year: false }));
//     if (input.year >= yearValid) {
//       setToolBorder((prev) => ({ ...prev, year: true }));
//     } else {
//       setToolBorder((prev) => ({ ...prev, year: false }));
//     }
//   };

//   const toolFacusHandleDate = (e) => {
//     setToolBorder((prev) => ({ ...prev, year: false }));
//     if (input.year >= yearValid) {
//       setToolTip((prev) => ({ ...prev, year: true }));
//     } else {
//       setToolTip((prev) => ({ ...prev, year: false }));
//       setFildEdit((prev) => ({ ...prev, year: false }));
//     }
//   };

//   const [infoTool, setInfoTool] = useState({});
//   const infoToolOn = (e) => {
//     setInfoTool((prev) => ({ ...prev, [e.target.name]: true }));
//   };
//   const infoToolOff = (e) => {
//     setInfoTool((prev) => ({ ...prev, [e.target.name]: false }));
//   };

//   // handle from submit
//   const handleRegister = (e) => {
//     e.preventDefault();

//     // chack validation  43:00
//     if (
//       !input.fname ||
//       !input.sname ||
//       !input.emailorphone ||
//       !input.gender ||
//       !input.password
//     ) {
//       regErrorFildes(input, setToolBorder);
//       return createTost("All fileds are required!");
//     } else {
//       dispatch(
//         userRegister(
//           {
//             first_name: input.fname,
//             surname: input.sname,
//             phoneORemail: input.emailorphone,
//             password: input.password,
//             birth_date: input.day,
//             birth_month: input.month,
//             birth_year: input.year,
//             gender: input.gender,
//             gender_custom: input.gender_custom,
//             gender_pronoun: input.gender_pronoun,
//           },
//           setRegister,
//           navigate,
//           e,
//           setInput
//         )
//       );
//     }
//   };

//   return (
//     <>
//       {/* <!-- MODAL BOX  --> */}
//       <div className="blur-box">
//         <div className="sign-up-card">
//           <div className="sign-up-header">
//             <div className="sign-up-content">
//               <span>Sign Up</span>
//               <span>It's quick and easy.</span>
//             </div>
//             <button onClick={() => setRegister(false)}>
//               <img src={crouseBtn} alt="" />
//             </button>
//           </div>
//           <div className="sign-up-body">
//             <form onSubmit={handleRegister} id={"kkk"}>
//               <div className="reg-form reg-form-inline">
//                 <label className="tooltipBox ">
//                   <span
//                     className={`toolTip ${
//                       fildEdit.fname && toolTip.fname ? "toolTipVisible" : ""
//                     }`}
//                   >
//                     <div>What's your name?</div>
//                   </span>

//                   <input
//                     className={`w-100 ${toolBorder.fname ? "borderRed" : ""}`}
//                     onFocus={toolFacusHandle}
//                     onBlur={tollBlurHandle}
//                     onChange={handleInputChange}
//                     name="fname"
//                     ref={useref}
//                     value={input.fname}
//                     type="text"
//                     placeholder="First name"
//                   />
//                   <span
//                     className={`exclamation exc50 ${
//                       toolBorder.fname ? "true" : ""
//                     }`}
//                   ></span>
//                 </label>

//                 <label className="tooltipBox ">
//                   <span
//                     className={`toolTip surnametool ${
//                       toolTip.sname && fildEdit.sname ? "toolTipVisible" : ""
//                     }`}
//                   >
//                     <div>What's your name?</div>
//                   </span>
//                   <input
//                     className={`w-100 ${toolBorder.sname ? "borderRed" : ""}`}
//                     onFocus={toolFacusHandle}
//                     onBlur={tollBlurHandle}
//                     onChange={handleInputChange}
//                     name="sname"
//                     value={input.sname}
//                     type="text"
//                     placeholder="Surname"
//                   />
//                   <span
//                     className={`exclamation exc50  ${
//                       toolBorder.sname ? "true" : ""
//                     }`}
//                   ></span>
//                 </label>
//               </div>
//               <div className="reg-form">
//                 <label className="tooltipBox ">
//                   <span
//                     className={`toolTip ${
//                       toolTip.emailorphone && fildEdit.emailorphone
//                         ? "toolTipVisible"
//                         : ""
//                     }`}
//                   >
//                     <div>
//                       you'll use this whan you log in and if you ever need to
//                       reset your password
//                     </div>
//                   </span>

//                   <input
//                     className={`w-100 ${
//                       toolBorder.emailorphone ? "borderRed" : ""
//                     }`}
//                     onFocus={toolFacusHandle}
//                     onBlur={tollBlurHandle}
//                     onChange={handleInputChange}
//                     name="emailorphone"
//                     value={input.emailorphone}
//                     type="text"
//                     placeholder="Mobile number or email address"
//                   />
//                   <span
//                     className={`exclamation ${
//                       toolBorder.emailorphone ? "true" : ""
//                     }`}
//                   ></span>
//                 </label>
//               </div>

//               <div className="reg-form">
//                 <label className="tooltipBox ">
//                   <span
//                     className={`toolTip ${
//                       toolTip.password && fildEdit.password && "toolTipVisible"
//                     }`}
//                   >
//                     <div>
//                       Enter a combination of at least six numbers, letters and
//                       punctuation marks (such as ! and &).
//                     </div>
//                   </span>

//                   <input
//                     className={`w-100 ${toolBorder.password && "borderRed"}`}
//                     onFocus={toolFacusHandle}
//                     onBlur={tollBlurHandle}
//                     onChange={handleInputChange}
//                     name="password"
//                     value={input.password}
//                     type="text"
//                     placeholder="New password"
//                   />
//                   <span
//                     className={`exclamation ${toolBorder.password && "true"}`}
//                   ></span>
//                 </label>
//               </div>

//               <div className="reg-form">
//                 <div className="tooltipBox">
//                   <span
//                     className={`toolTip birth-date  ${
//                       toolTip.year && fildEdit.year && "toolTipVisible"
//                     }`}
//                   >
//                     <div>
//                       It looks like you've entered the wrong info. Please make
//                       sure that you use your real date of birth.
//                     </div>
//                   </span>
//                   <span
//                     className={`exclamation birth-date ${
//                       toolBorder.year && "true"
//                     }`}
//                   ></span>

//                   <span className="input-title">
//                     <span className="title-name">Date of birth</span>
//                     <label
//                       title="Click for more information"
//                       className="titleClick"
//                     >
//                       {infoTool.dateinfo && (
//                         <>
//                           <span className="info-tooltip ">
//                             Providing your birthday helps make sure that you get
//                             the right Facebook experience for your age. If you
//                             want to change who sees this, go to the About
//                             section of your profile. For more details, please
//                             visit our <a href="/">Privacy Policy</a>.
//                           </span>
//                         </>
//                       )}
//                       <button
//                         className="infobtn"
//                         name="dateinfo"
//                         onBlur={infoToolOff}
//                         onClick={infoToolOn}
//                         type="button"
//                         id="jkl"
//                       />
//                     </label>
//                   </span>
//                   <div className="reg-form-select">
//                     <select
//                       className={`${toolBorder.year && "borderRed"}`}
//                       onFocus={toolFacusHandleDate}
//                       onBlur={tollBlurHandleDate}
//                       onChange={handleInputChange}
//                       name="day"
//                       id=""
//                     >
//                       {day.map((item, index) => (
//                         <option value={item} key={index}>
//                           {item}
//                         </option>
//                       ))}
//                     </select>
//                     <select
//                       className={`${toolBorder.year && "borderRed"}`}
//                       onFocus={toolFacusHandleDate}
//                       onBlur={tollBlurHandleDate}
//                       onChange={handleInputChange}
//                       name="month"
//                       id=""
//                     >
//                       {month.map((item, index) => (
//                         <option value={item} key={index}>
//                           {item}
//                         </option>
//                       ))}
//                     </select>
//                     <select
//                       className={`${toolBorder.year && "borderRed"}`}
//                       onChange={handleInputChange}
//                       onFocus={toolFacusHandleDate}
//                       onBlur={tollBlurHandleDate}
//                       name="year"
//                       id=""
//                     >
//                       {year.map((item, index) => (
//                         <option value={item} key={index}>
//                           {item}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="reg-form">
//                 <span className="input-title">
//                   <span className="title-name">Gender</span>
//                   <label
//                     title="Click for more information"
//                     className="titleClick"
//                   >
//                     {infoTool.genderinfo && (
//                       <>
//                         <a href="/" className="info-tooltip">
//                           You can change who sees your gender on your profile
//                           later. Select Custom to choose another gender, or if
//                           you'd rather not say.
//                         </a>
//                       </>
//                     )}
//                     <button
//                       className="infobtn"
//                       name="genderinfo"
//                       onBlur={infoToolOff}
//                       onClick={infoToolOn}
//                       type="button"
//                     />
//                   </label>
//                 </span>
//                 <div
//                   className={`reg-form-select ${
//                     toolBorder.gender && "border-error"
//                   }`}
//                 >
//                   <label>
//                     Female
//                     <input
//                       onBlur={tollBlurHandle}
//                       className="border-red"
//                       onChange={handleInputChange}
//                       value="Famale"
//                       type="radio"
//                       name="gender"
//                     />
//                   </label>
//                   <label>
//                     Male
//                     <input
//                       onBlur={tollBlurHandle}
//                       onChange={handleInputChange}
//                       value="Male"
//                       type="radio"
//                       name="gender"
//                     />
//                   </label>
//                   <label>
//                     Custom
//                     <input
//                       onBlur={tollBlurHandle}
//                       onChange={handleInputChange}
//                       value="Custom"
//                       type="radio"
//                       name="gender"
//                     />
//                   </label>
//                 </div>
//               </div>

//               {input.gender === "Custom" && (
//                 <>
//                   <div className="reg-form reg-form-select w-100">
//                     <div className="tooltipBox">
//                       <span
//                         className={`toolTip   ${
//                           toolTip.gender_pronoun && fildEdit.gender_pronoun
//                             ? "toolTipVisible"
//                             : ""
//                         }`}
//                       >
//                         <div>
//                           It looks like you've entered the wrong info. Please
//                           make sure that you use your real date of birth.
//                         </div>
//                       </span>
//                       <span
//                         className={`exclamation birth-date ${
//                           toolBorder.gender_pronoun ? "true" : ""
//                         }`}
//                       ></span>

//                       <select
//                         className={`w-100   ${
//                           toolBorder.gender_pronoun ? "borderRed" : ""
//                         }`}
//                         onChange={handleInputChange}
//                         onFocus={toolFacusHandle}
//                         onBlur={tollBlurHandle}
//                         name="gender_pronoun"
//                       >
//                         <option selected value="">
//                           Select your pronoun
//                         </option>
//                         <option value={"1"}>
//                           She: "Wish her a happy birthday!"
//                         </option>
//                         <option value={"2"}>
//                           He: "Wish him a happy birthday!"
//                         </option>
//                         <option value={"3"}>
//                           They: "Wish them a happy birthday!"
//                         </option>
//                       </select>
//                     </div>

//                     <span className=" pronoun-txt">
//                       Your pronoun is visible to everyone.
//                     </span>
//                   </div>
//                   <div className="reg-form">
//                     <input
//                       onChange={handleInputChange}
//                       name="gender_custom"
//                       placeholder="Gender (optional)"
//                       type="text"
//                     />
//                   </div>
//                 </>
//               )}

//               <div className="reg-form">
//                 <p>
//                   People who use our service may have uploaded your contact
//                   information to Facebook. <a href="/">Learn more.</a>
//                 </p>
//               </div>
//               <div className="reg-form">
//                 <p>
//                   By clicking Sign Up, you agree to our <a href="/">Terms</a>,
//                   <a href="/">Privacy Policy</a> and
//                   <a href="/">Cookies Policy</a>. You may receive SMS
//                   notifications from us and can opt out at any time.
//                 </p>
//               </div>

//               <div className="reg-form">
//                 <button type="submit">Sign Up</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Register;
