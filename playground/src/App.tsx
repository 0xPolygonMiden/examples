import SettingsProvider from "./contexts/SettingsProvider"
import ThemeProvider from "./contexts/ThemeProvider"
import StorageProvider from "./contexts/StorageProvider"
import PlaygroundProvider from "./contexts/PlaygroundProvider"
import AppRouter from "./AppRouter"
import FileManagerProvider from "./contexts/FileManagerProvider"
import "./styles/styles.scss"

const App = () => {
    return <>
        <StorageProvider>
            <SettingsProvider>
                <ThemeProvider>
                    <PlaygroundProvider>
                        <FileManagerProvider>
                            <AppRouter />
                        </FileManagerProvider>
                    </PlaygroundProvider>
                </ThemeProvider>
            </SettingsProvider>
        </StorageProvider>
    </>
}

export default App