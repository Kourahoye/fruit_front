import './App.css'
import { Routes, Route } from "react-router-dom";
import { ApolloProvider } from '@apollo/client/react';
import  client from "./apollo";
import Login from "./components/login";
import Register from "./components/register";
import Filter from "./components/filter";
import Dashbord from './components/dashbord';
import CreateTag from './components/createTag';
import Colors from './components/colors';
import Fruits from './components/fruits';
import FruitInfos from './components/fruitInfos';
import ProtectedRoute from './services/guard';
// import ProtectedRoute from './services/guard';

function App() {
  return (
    <ApolloProvider client={client}>
      {/* <Suspense fallback={<p>Loading...</p>}> */}
      <Dashbord />
        <Routes>
        <Route path="/login" element= {<Login />} />
        <Route path="/register" element= {<Register />} />
          <Route path='*' element = {<>
            <p className='text-3xl text-center text-red-600 animate-pulse delay-1000'>404 Not found</p>
            </>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Filter />} />
          <Route path='/tags' element={ <CreateTag />} />
          <Route path="/colors" element={<Colors />} />
          <Route path='/fruits' element={<Fruits />} />
          <Route path='/fruit/:id' element={<FruitInfos />} />
          </Route>
        </Routes>
      {/* </Suspense> */}
    </ApolloProvider>
  );
}

export default App;
