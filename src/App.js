import { BrowserRouter, Routes , Route} from "react-router-dom";

import Room from "./pages/Room";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes >
        <Route exact path='/room/:id' element={ <Room/> }/>
        <Route exact path='/' element={ <Home/> }/>
        <Route path='*'  element={ <NotFound/> }/>
      </Routes >
    </BrowserRouter>
  );
}

export default App;
