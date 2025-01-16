import {ActionMap, AuthState, AuthUser, JWTContextType} from "@/@types/auth";
import React, {createContext, ReactNode, useReducer, useEffect} from "react";
import {useNavigate} from 'react-router';
import {useSnackbar} from 'notistack';
import {useMutation, useQuery} from '@tanstack/react-query';
import AuthRepository, {SignInPayload, SignInResponse} from "@/apis/service/auth";
import {AxiosError} from 'axios';
import {RESTErrorResponse} from "@/@types/api";
import {setSession, isValidToken} from "@/utils/jwt";
// import { SignUpPayload, SignUpResponse } from "@/@types/user";
import {PATH_AUTH} from "@/routes/paths";
import userModule from "@/apis/user";
import {SignUpPayload, SignUpResponse,} from "@/@types/user";
// import {Simulate} from "react-dom/test-utils";
// import error = Simulate.error;

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({children, }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const {mutateAsync: mutateAsyncSignIn} = useMutation<SignInResponse, AxiosError<RESTErrorResponse>, SignInPayload>({
    mutationFn: (payload: SignInPayload) => AuthRepository.signIn(payload),
    onError: (error: AxiosError<RESTErrorResponse>) => {
      enqueueSnackbar(error.response?.data.message, {
        variant: 'error',
      });
    },
    onSuccess: (data: SignInResponse) => {
      setSession(data.result.accessToken);
      dispatch({
        type: Types.Login,
        payload: {
          user: data.result.currentUser,
        },
      });
      enqueueSnackbar('Đăng nhập thành công!', {
        variant: 'success',
      });
    },
  });


  const {refetch: fetchUser} = useQuery<AuthUser, AxiosError>({
    queryKey: ['getUser'],
    queryFn: async () => {
      try {
        const data = await AuthRepository.getUser();
        if (!data.error) {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user: data,
            },
          });
        } else {
          await logout();
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
        return data;
      } catch (error) {
        await logout();
        throw error;
      }
    },
    enabled: false,
    refetchOnWindowFocus: false
  });

  const {mutateAsync: mutateAsyncSignUp} = useMutation<SignUpResponse, AxiosError, SignUpPayload>({
    mutationFn: (payload: SignUpPayload) => userModule.signUp(payload) as unknown as Promise<SignUpResponse>,
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Đăng ký tài khoản thành công. Vui lòng đăng nhập!', {
          variant: 'success',
        });
        navigate(PATH_AUTH.login);
      } else {
        enqueueSnackbar(data.error, {
          variant: 'error',
        });
      }
    },
  });

  useEffect(() => {
    const initialize = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        await fetchUser();
      } else {
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, [fetchUser]);

  const login = async (payload: SignInPayload) => {
    await mutateAsyncSignIn(payload);
  };

  const register = async (payload: SignUpPayload) => {
    await mutateAsyncSignUp(payload);
  };

  const logout = async () => {
    setSession(null);
    dispatch({type: Types.Logout});
    enqueueSnackbar('Đã đăng xuất!', {
      variant: 'info',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export {AuthContext, AuthProvider};