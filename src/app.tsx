import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/contents");
      const json = await response.json();
      // eslint-disable-next-line no-console
      console.log({ json });
    })();
  }, []);

  return (
    <div className="App bg-white">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload. Me
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
