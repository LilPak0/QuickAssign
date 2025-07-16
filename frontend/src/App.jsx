import logo from './logo.svg';
function App() {
  return (
    <div className="bg-gray-800">
      <header className="">
        <img src={logo} className="" alt="logo" />
        <p className='text-white'>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="text-blue-500 hover:text-blue-800"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
