import { Link} from 'react-router-dom'
import { useState, useEffect } from "react"
import { Apple, LogInIcon, LucideUser, PaletteIcon, TagsIcon } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
const Dashbord = () => {
    const [theme, setTheme] = useState('cupcake')

    useEffect(() => {
        // Load theme from cookies on component mount
        const savedTheme = getCookie("theme") || "cupcake"
        setTheme(savedTheme)
        document.documentElement.setAttribute("data-theme", savedTheme)
    }, [])

    const setCookie = (name, value, days) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString()
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
    }

    const getCookie = (name) => {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=')
            return parts[0] === name ? decodeURIComponent(parts[1]) : r
        }, '')
    }

    const handleThemeChange = (e) => {
        const selectedTheme = e.target.value
        setTheme(selectedTheme)
        document.documentElement.setAttribute("data-theme", selectedTheme)
        setCookie("theme", selectedTheme, 365)
    }

    return (
        <>
            <header className="navbar bg-base-100 shadow-sm mb-4 pr-5 print:hidden">
                <div className="flex-1">
                    <label htmlFor="my-drawer" role='button' className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </label>
                    <Link to="/" className="btn btn-ghost text-xl">Gestion RH/ <sub>
                        <span className="text-xs">daisyUI</span>
                    </sub>
                    </Link>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex="0" role="button"
                        className="btn btn-circle btn-ghost avatar avatar-online before:w-3 before:block before:h-3 before:rounded-full before:absolute before:top-o before:right-0 hover:ring-2 hover:ring-blue-800">
                        <div className="w-20 rounded-full">
                           <LucideUser />
                        </div>
                    </div>
                    <ul tabIndex="0" className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between" href="#">Profil</a>
                        </li>
                        {localStorage.getItem("auth")
                            ? <Logout className="btn btn-active btn-error" />
                            : <Link to="/login" className='btn btn-active btn-primary'>Login</Link>
                        }
                    </ul>
                </div>
            </header>

            <div className="drawer z-30">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content"></div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 min-h-full flex flex-col gap-3 items-stretch glass text-base-content">
                        <div className="h-28 w-full bg-cover bg-center bg-blue-600 flex justify-center items-end">
                            <p className="w-full text-center text-4xl glass text-black">
                                User
                            </p>
                        {
                            (localStorage.getItem("access")) ? <li>
                         <Link to="/login" className="btn btn-block justify-start btn-accent btn-ghost text-white">
                               <LogInIcon />
                                <span className="text-white">Login</span>
                        </Link>
                        </li>:null
                        }
                        </div>
                         <li>
                         <Link to="/" className="btn btn-block justify-start btn-accent btn-ghost text-white">
                                <FontAwesomeIcon icon={faFilter} />
                                <span className="text-white">Filtre</span>
                        </Link> 
                        <Link to="/tags" className="btn btn-block justify-start btn-accent btn-ghost text-white">
                                <TagsIcon />
                                <span className="text-white">Tags</span>
                        </Link>
                        </li>
                        <li>
                         <Link to="/colors" className="btn btn-block justify-start btn-accent btn-ghost text-white">
                                <PaletteIcon />
                                <span className="text-white">Colors</span>
                        </Link>
                        </li> 
                        <li>
                         <Link to="/fruits" className="btn btn-block justify-start btn-accent btn-ghost text-white">
                                <Apple />
                                <span className="text-white">Fruits</span>
                        </Link>
                        </li>
                        <li>
                            <button onClick={() => document.getElementById('my_modal_1').showModal()}
                                className="btn btn-block justify-start btn-accent btn-ghost text-white">
                                <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
                                        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeLinecap="square"
                                            strokeMiterlimit="10" strokeWidth="2"></circle>
                                        <path
                                            d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z"
                                            fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10"
                                            strokeWidth="2"></path>
                                    </g>
                                </svg>
                                <span>Settings</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <dialog id="my_modal_1" className="modal">
                <div className="modal-box max-w-5xl">
                    <h3 className="text-lg font-bold mb-4 text-black dark:text-white">🎨 Choisissez un thème</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Default" value="desk" checked={theme === 'desk'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Light" value="light" checked={theme === 'light'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Cupcake" value="cupcake" checked={theme === 'cupcake'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Bumblebee" value="bumblebee" checked={theme === 'bumblebee'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Emerald" value="emerald" checked={theme === 'emerald'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Corporate" value="corporate" checked={theme === 'corporate'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Winter" value="winter" checked={theme === 'winter'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Dark" value="dark" checked={theme === 'dark'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Night" value="night" checked={theme === 'night'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Sunset" value="sunset" checked={theme === 'sunset'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Forest" value="forest" checked={theme === 'forest'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Luxury" value="luxury" checked={theme === 'luxury'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Dracula" value="dracula" checked={theme === 'dracula'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Black" value="black" checked={theme === 'black'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Dim" value="dim" checked={theme === 'dim'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Business" value="business" checked={theme === 'business'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Coffee" value="coffee" checked={theme === 'coffee'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Synthwave" value="synthwave" checked={theme === 'synthwave'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Retro" value="retro" checked={theme === 'retro'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Valentine" value="valentine" checked={theme === 'valentine'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Aqua" value="aqua" checked={theme === 'aqua'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="CMYK" value="cmyk" checked={theme === 'cmyk'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Halloween" value="halloween" checked={theme === 'halloween'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Lofi" value="lofi" checked={theme === 'lofi'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Pastel" value="pastel" checked={theme === 'pastel'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Fantasy" value="fantasy" checked={theme === 'fantasy'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Wireframe" value="wireframe" checked={theme === 'wireframe'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Autumn" value="autumn" checked={theme === 'autumn'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Garden" value="garden" checked={theme === 'garden'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Nord" value="nord" checked={theme === 'nord'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Woodland" value="woodland" checked={theme === 'woodland'} />
                        <input type="radio" name="theme-buttons" onChange={handleThemeChange} className="btn theme-controller" aria-label="Slate" value="Slate" checked={theme === 'Slate'} />
                    </div>
                    <div className="modal-action mt-4">
                        <form method="dialog">
                            <button className="btn">Fermer</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default Dashbord