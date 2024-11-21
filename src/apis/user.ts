import {SignUpPayload, User} from "@/@types/user";
import {RESTErrorResponse} from "@/@types/api";
import apiBackend from "@/apis/connection/api-backend";

type SignUpResponse = {
  createUser: User;
} & RESTErrorResponse;

const userModule = {
  async signUp(variables: SignUpPayload): Promise<SignUpResponse> {
    const {data} = await apiBackend.post<SignUpResponse>('/new-user', variables);
    return data;
  }
};

export default userModule;