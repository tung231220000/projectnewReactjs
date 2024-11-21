import {User} from "@/@types/user";
import {RESTErrorResponse} from "@/@types/api";
import apiBackend from "@/apis/connection/api-backend";
import {AUTH_SERVICE_GET_USER_ENDPOINT, AUTH_SERVICE_SIGN_IN_ENDPOINT} from "@/utils/constant";

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignInResponse = {
  result: {
    accessToken: string;
    currentUser: User;
  };
} & RESTErrorResponse;

type GetUserResponse = User & RESTErrorResponse;

const AuthRepository = {
  async signIn(payload: SignInPayload): Promise<SignInResponse> {
    const {data} = await apiBackend.post<SignInResponse>(
      AUTH_SERVICE_SIGN_IN_ENDPOINT,
      payload
    );

    return data;
  },
  async getUser(): Promise<GetUserResponse> {
    const {data} = await apiBackend.get<GetUserResponse>(
      AUTH_SERVICE_GET_USER_ENDPOINT
    );

    return data;
  },
};

export default AuthRepository;