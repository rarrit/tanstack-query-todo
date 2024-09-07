import { BrowserRouter, Route, Routes } from "react-router-dom"
import Main from "../pages/Main"
import Empty from "../pages/Empty"
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/empty" element={<Empty/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
