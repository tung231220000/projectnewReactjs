import {RESTErrorResponse} from "@/@types/api";

export enum Gender {
  MR = 'Ông',
  MRS = 'Bà',
}

export type User = {
  _id: string;
  authentication: {
    email: string;
    avatar: string;
  };
  generalInformation: {
    surnameAndMiddleName: string;
    name: string;
    gender: Gender;
    dayOfBirth: Date;
    address: string;
    phoneNumber: string;
  };
};

export type UserMock = {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  company: string;
  isVerified: boolean;
  status: string;
  role: string;
};

export type SignUpPayload = {
  email: string;
  password: string;
  surnameAndMiddleName: string;
  name: string;
  gender: Gender;
  phoneNumber: string;
};

export type SignUpResponse = SignUpPayload & RESTErrorResponse;
