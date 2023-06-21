import ConfigProvider  from "./contexts/ConfigProvider";
import Router from "./Router";

function App() {
  return (
    <ConfigProvider>
      <Router />  
    </ConfigProvider>
  );
}

export default App;
