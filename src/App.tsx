import { useEffect, useRef } from 'react';

import { Routes, Route, Link } from 'react-router'

//Pages:
import Dashboard from './pages/Dashboard'
import AddBook from './pages/AddBook'
import EditBook from './pages/EditBook';

import addIcon from "./assets/icons/plus.svg";
import gitHubIcon from "./assets/icons/github.svg";

function App() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleHeadersPadding = () => {
      if(headerRef.current) {
        if(window.scrollY > 10) {
          headerRef.current.style.paddingBlock = ".65rem";
        } else {
          headerRef.current.style.paddingBlock = "1rem";
        }
      }
    }

    window.addEventListener("scroll", handleHeadersPadding)

    return () => window.removeEventListener("scroll", handleHeadersPadding);
  }, []);

  return (
    <section className='relative min-h-[100vh]'>
        <header ref={headerRef} className='flex items-center justify-around py-4 fixed w-full bg-[#34495e] duration-300 shadow-sm z-30'>
          <Link to={"/"}><h1 className='text-xl'>Book Managing System</h1></Link>

          <Link to="/add-book">
            <button className='flex items-center gap-2 text-white border text-[1.1rem] px-[.75rem] py-[.5rem] bg-[#74b9ff] duration-200 hover:bg-[#2980b9] rounded-md'>Add Book <img src={addIcon} alt="" data-type="icon" /></button>
          </Link>
        </header>

        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/add-book' element={<AddBook />} />
          <Route path='/books/edit/:id' element={<EditBook />}></Route>
        </Routes>

        <footer className='absolute bottom-0 w-full h-20 bg-[#34495e]'>
          <div className='w-full h-full flex items-center justify-center'>
            <a href="https://github.com/sdeffff" target='_blank'>
              <img src={gitHubIcon} className='max-w-14' />
            </a>  
          </div>
        </footer>
    </section>
  )
}

export default App