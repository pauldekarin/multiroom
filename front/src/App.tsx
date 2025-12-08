import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {WelcomePage} from "./pages/WelcomePage.tsx";
import {MainPage} from "./pages/MainPage.tsx";
import {StartedProvider} from "./components/StartedProvider.tsx";

function App() {
    return (
        <BrowserRouter>
            <StartedProvider>
                <Routes>
                    <Route path="/" element={<WelcomePage/>}/>
                    <Route path="/app" element={<MainPage/>}/>
                </Routes>
            </StartedProvider>
        </BrowserRouter>
    )
}

export default App
