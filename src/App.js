import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

function createRelayModernEnvironment(getTokenSilently) {
  const fetchFunction = async (params, variables) => {
    const token = await getTokenSilently();

    const response = await fetch(`http://my.api.com/graphql`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: params.text,
        variables,
      }),
    });

    return response.json();
  };

  const source = new RecordSource();
  const store = new Store(source);
  const network = Network.create(fetchFunction);

  return new Environment({
    network,
    store,
  });
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Auth0Provider client_id="" domain="">
          <MyAuthBackedApp />
        </Auth0Provider>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

const MyAuthBackedApp = () => {
  const x = useAuth0();

  return x.isAuthenticated ? (
    <RelayEnvironmentProvider environment={createRelayModernEnvironment(x.getAccessTokenSilently)}>
      <RelayComponent />
    </RelayEnvironmentProvider>
  ) : (
    <div>Please log in...</div>
  );
};

const RelayComponent = () => {
  // Here you'd put your fragments, or useQuery's

  return <div />;
};

export default App;
