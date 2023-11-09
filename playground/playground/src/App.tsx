import ConfigWindow from "./components/ConfigWindow";
import PopoverManager from "./components/PopoverManager";
import ConfigProvider  from "./contexts/ConfigProvider";
import MidenPlaygroundProvider from "./contexts/MidenPlaygroundProvider";
import StorageProvider from "./contexts/StorageProvider";
import Router from "./Router";

function App() {
  return (
    <ConfigProvider>
      <StorageProvider>
        <MidenPlaygroundProvider>
          <Router />  
          <PopoverManager />
          <ConfigWindow />
        </MidenPlaygroundProvider>
      </StorageProvider>
    </ConfigProvider>
  );
}

export default App;
