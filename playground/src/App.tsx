import ConfigWindow from "./components/ConfigWindow";
import PopoverManager from "./components/PopoverManager";
import ConfigProvider  from "./contexts/ConfigProvider";
import Router from "./Router";

function App() {
  return (
    <ConfigProvider>
      <Router />  
      <PopoverManager />
      <ConfigWindow />
    </ConfigProvider>
  );
}

export default App;
