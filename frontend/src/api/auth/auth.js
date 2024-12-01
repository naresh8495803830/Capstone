import { authMethod } from "../common";
import { authbaseUrl } from "../url";

export async function handleSendOtp(email) {
  let obj = {
    email: email,
  };

  const data = await authMethod(authbaseUrl, "user/login", obj);
  return data;
}

export async function handleVerifyOtp(email, otp) {
  let obj = {
    email: email,
    otp: otp,
  };
  const data = await authMethod(authbaseUrl, "user/verify", obj);
  return data;
}
