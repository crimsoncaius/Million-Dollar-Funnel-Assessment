import { Controller } from "react-hook-form";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

type InfoProps = {
  setMode: React.Dispatch<React.SetStateAction<String>>;
  register: any;
  handleSubmit: any;
  errors: any;
  control: any;
  answerList: any;
};

function Info(props: InfoProps) {
  const { register, handleSubmit, errors, control, answerList } = props;

  const { setMode } = props;

  const onSubmit = (data: any) => {
    const sendData = {
      ...data,
      answers: answerList,
    };

    console.log(sendData);

    axios
      .post("https://mdfa-api.com/api/prospect", {
        sendData,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));

    setMode("finished");
    window.location.href = "https://mdfa.tres.sg/booking";
  };

  return (
    <div className="flex flex-col w-screen h-screen items-center p-4 md:flex-row md:p-0 md:justify-center">
      <div className="flex flex-col w-full max-w-md gap-4 justify-center">
        <div className="text-blue-900 text-7xl">Info</div>
        <div className="text-blue-900">
          fill in your details to submit your assessment
        </div>
        <label className="text-blue-800 text-xl md:text-3xl">Name</label>
        <input
          className="text-xl p-2 border-2 rounded"
          {...register("name")}
        ></input>
        {errors.name && <span className="text-xs text-red-600">Required</span>}

        <label className="text-blue-800 text-xl md:text-3xl">
          Phone Number
        </label>
        <div>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                inputStyle={{ width: "100%" }}
                value={value}
                onChange={onChange}
                preferredCountries={["sg"]}
                country={"sg"}
              />
            )}
          />
        </div>
        {errors.phoneNumber && (
          <span className="text-xs text-red-600">
            Valid phone number required
          </span>
        )}

        <label className="text-blue-800 text-xl md:text-3xl">Email</label>
        <input
          className="text-xl p-2 border-2 rounded"
          {...register("email")}
        ></input>
        {errors.email && (
          <span className="text-xs text-red-600">{errors.email?.message}</span>
        )}

        <label className="text-blue-800 text-xl md:text-3xl">Company</label>
        <input
          className="text-xl p-2 border-2 rounded"
          {...register("company")}
        ></input>
        {errors.company && (
          <span className="text-xs text-red-600">Required</span>
        )}
        <button
          className="bg-blue-600 hover:bg-blue-900 text-white text-xl mt-8 p-2 w-full md:w-auto md:text-3xl md:mt-16 rounded"
          onClick={handleSubmit(onSubmit)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Info;
