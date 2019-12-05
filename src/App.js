import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./App.scss";
import ConfirmationPage from "./pages/ConfirmationPage";
import { Config } from "@baltimorecounty/javascript-utilities";
import ErrorPage from "./pages/ErrorPage";
const { setConfig } = Config;

const configValues = {
  local: {
    apiRoot: "//localhost:54727/api/transientTax"
  },
  development: {
    apiRoot: "http://testservices.baltimorecountymd.gov/api/transientTax"
  },
  staging: {
    apiRoot: "http://testservices.baltimorecountymd.gov/api/transientTax"
  },
  production: {
    apiRoot: "http://services.baltimorecountymd.gov/api/transientTax"
  }
};

setConfig(configValues);
function App() {
  return (
    <div className="tt_app">
      <Router>
        {/* TODO: this needs to be integrated into the multi-page app */}
        <Route exact path="/" component={{}} />
        <Route
          exact
          path="/confirmation/:confirmationNumber"
          component={ConfirmationPage}
        />
        <Route exact path="/error/:errorType" component={ErrorPage} />
      </Router>
    </div>
  );
}

export default App;
