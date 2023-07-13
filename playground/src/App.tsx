import ConfigWindow from "./components/ConfigWindow";
import PopoverManager from "./components/PopoverManager";
import ConfigProvider  from "./contexts/ConfigProvider";
import StorageProvider from "./contexts/StorageProvider";
import Router from "./Router";

function App() {
  return (
    <ConfigProvider>
      <StorageProvider>
        <Router />  
        <PopoverManager />
        <ConfigWindow />
      </StorageProvider>
    </ConfigProvider>
  );
}

export default App;
