import React from "react";
import AuthContext from "./Auth/AuthContext";
import GeneralContext from "./General/GeneralContext";


export const ContextCombined = React.createContext();
// This is a reusable piece that could be used by any component that requires both contexts.
const ProvideCombinedContext = props => {
  return (
    <AuthContext.Consumer>
      {authContext => (
        <GeneralContext.Consumer>
          {generalContext => (
            <ContextCombined.Provider value={{ authContext, generalContext }}>
              {props.children}
            </ContextCombined.Provider>
          )}
        </GeneralContext.Consumer>
      )}
    </AuthContext.Consumer>
  );
};
export default ProvideCombinedContext;