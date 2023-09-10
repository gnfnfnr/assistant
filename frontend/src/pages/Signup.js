import React, { useRef } from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../config";
import { styled } from "styled-components";
import ShowErrorMessage from "../components/login/ShowErrorMessage";

const SignupBox = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  color: white;
  width: 30%;
  font-size: 27px;

  & > div:nth-child(n) {
    margin-top: 40px;
  }

  @media (max-width: 800px) {
    width: 80%;
    font-size: 20px;
  }
`;

const FormInputBox = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 30px;
  border: 1px solid;
  border-radius: 10px;
  border-bottom: 3px solid;

  & > input {
    all: unset;
    padding: 20px 10px;

    &::placeholder {
      color: white;
    }
  }
  & > input:not(:last-child) {
    border-bottom: 3px solid white;
  }
`;
const NavButton = styled.div`
  padding: 20px 0;
  background: #cd9d71;
  text-align: center;
  box-shadow: 0px 4px 4px 0px #00000040;
  text-transform: uppercase;
  border-radius: 10px;
  cursor: pointer;
  max-width: 100%;
  width: 100%;
`;

const FormButton = styled.button`
  all: unset;
  padding: 20px 0;
  background: #cd9d71;
  text-align: center;
  box-shadow: 0px 4px 4px 0px #00000040;
  text-transform: uppercase;
  margin: 40px 0;
  border-radius: 10px;
  cursor: pointer;
  max-width: 100%;
  width: 100%;
`;

const ConfrimPassword = styled.input`
  width: 100%;
  all: unset;
  padding: 20px 10px;
  &::placeholder {
    color: white;
  }
  border-bottom: 3px solid;
`;

const CertifyPhone = function ({
  phoneData,
  setPhoneData,
  setCertify,
  setMoveAccess,
  moveAccess,
}) {
  const [errorMessage, setErrorMessage] = useState({});
  const [certifyNumber, setCertifyNumber] = useState("");
  const process = {
    send: (
      <NavButton
        onClick={() => {
          axios
            .post(API.USER_NUMBER_SEND, {
              name: phoneData.username,
              phone: phoneData.phone,
            })
            .then((res) => {
              setMoveAccess("certify");
              setErrorMessage({ sucess: res.data.result });
            })
            .catch((error) => setErrorMessage(error.response.data.message));
        }}
      >
        send
      </NavButton>
    ),
    certify: (
      <NavButton
        onClick={() => {
          axios
            .post(API.USER_NUMBER_CHECK, {
              name: phoneData.username,
              phone: phoneData.phone,
              auth: certifyNumber,
            })
            .then(() => setMoveAccess("next"))
            .catch((error) => setErrorMessage(error.response.data.message));
        }}
      >
        certify
      </NavButton>
    ),
    next: <FormButton>Next</FormButton>,
  };
  return (
    <SignupBox
      onSubmit={(event) => {
        event.preventDefault();
        setCertify(true);
      }}
    >
      <FormInputBox>
        <input
          placeholder="Name(필수)"
          value={phoneData.username}
          onChange={(event) =>
            setPhoneData({ ...phoneData, username: event.target.value })
          }
          required
        />
        <input
          placeholder="Phone_Number(필수)"
          value={phoneData.phone}
          onChange={(event) =>
            setPhoneData({ ...phoneData, phone: event.target.value })
          }
          required
        />

        {process === "certify" && (
          <input
            placeholder="인증번호"
            value={certifyNumber}
            onChange={(event) => setCertifyNumber(event.target.value)}
          />
        )}

        <ShowErrorMessage errorMessage={errorMessage} />
      </FormInputBox>
      {process[moveAccess]}
    </SignupBox>
  );
};

function Signup() {
  const navigate = useNavigate();
  // 전달 받은 props

  const [data, setData] = useState({
    users_id: "",
    email: "",
    password: "",
    password_check: "",
  });

  const [errorMessage, setErrorMessage] = useState({ dff: "dffd" });
  const checkRef = useRef();
  const [phoneData, setPhoneData] = useState({
    username: "",
    phone: "",
  });

  const [certify, setCertify] = useState(false);
  const [moveAccess, setMoveAccess] = useState("send");

  return (
    <>
      {certify ? (
        <SignupBox
          onSubmit={(event) => {
            event.preventDefault();
            setErrorMessage({ pending: "잠시만 기댜려주세요" });
            axios
              .post(API.USER_JOIN, {
                ...data,
                ...phoneData,
              })
              .then(() => {
                alert("회원가입에 성공했습니다. 로그인을 진행해주세요");
                navigate("/user/login");
              })
              .catch((error) => {
                setErrorMessage(error.response.data.message);
              });
          }}
        >
          <FormInputBox>
            <input
              placeholder="User ID(필수)"
              value={data.users_id}
              onChange={(event) =>
                setData({ ...data, users_id: event.target.value })
              }
              required
            />

            <input
              type="password"
              autoComplete="on"
              placeholder="Password(필수)"
              required
              value={data.password}
              onChange={(event) =>
                setData({ ...data, password: event.target.value })
              }
            />

            <ConfrimPassword
              required
              ref={checkRef}
              type="password"
              autoComplete="on"
              placeholder="Password Check(필수)"
              value={data.password_check}
              onChange={(event) =>
                setData({ ...data, password_check: event.target.value })
              }
            />
            <input
              autoComplete="on"
              placeholder="Email(선택)"
              value={data.email}
              onChange={(event) =>
                setData({ ...data, email: event.target.value })
              }
            />
            <ShowErrorMessage errorMessage={errorMessage} />
          </FormInputBox>
          <NavButton onClick={() => setCertify(false)}>Preious</NavButton>
          <FormButton>Sign up</FormButton>
        </SignupBox>
      ) : (
        <CertifyPhone
          setMoveAccess={setMoveAccess}
          phoneData={phoneData}
          setPhoneData={setPhoneData}
          setCertify={setCertify}
          moveAccess={moveAccess}
        />
      )}
    </>
  );
}

export default Signup;
