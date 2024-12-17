import { ReactNode, createContext, useEffect, useReducer } from "react";

const initialState: State = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || '{}') : null,
  token: localStorage.getItem("token"),
  activationToken: localStorage.getItem("activationToken"),
  activation_Code: localStorage.getItem("activation_Code"),
  dispatch: () => null
};

export const authContext = createContext(initialState);

interface State {
  user: any;
  token: string | null;
  activationToken: string | null;
  activation_Code: string | null;
  dispatch: React.Dispatch<Action>
}

interface Action {
  type: string;
  payload?: any;
}

const authReducer = (state: State, action: Action) =>
{
  switch (action.type)
  {
    case "ACTIVATE_USER":
      return {
        ...state,
        activationToken: action.payload.activationToken,
        activation_Code: action.payload.activation_Code,
        user: null,
        token: null
      }

    case "VERIFY_OTP":
      return {
        ...state,
        activationToken: null,
        activation_Code: null,
      }

    case "LOGIN_START":
      return {
        ...state,
        user: null,
        token: null,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.accessToken,
        activationToken: null,
        activation_Code: null
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        activationToken: null,
        activation_Code: null,
      };

    default:
      return state;
  }
};


export const AuthContextProvider = ({ children }: { children: ReactNode }) =>
{
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() =>
  {
    localStorage.setItem("user", JSON.stringify(state.user))
    localStorage.setItem("token", state.token);
    localStorage.setItem("activationToken", state.activationToken);
    localStorage.setItem("activation_Code", state.activation_Code);
  }, [state])

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        activationToken: state.activationToken,
        activation_Code: state.activation_Code,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
