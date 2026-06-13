
import {User, ShoppingCart} from "lucide-react";


export default function Header() {
  return (
    <header>
        <nav className="navbar flex flex-row items-center justify-between py-6 px-8 SpaceGrotesk text-white">
            <div className="logo text-brand font-bold text-2xl">4Wheels</div>
            <div className="search-bar">
              <ul className="nav-links flex flex-row items-center gap-4 ">
                  <li><a className="text-made-gray" href="/shop">Shop</a></li>
                  <li><a className="text-made-gray" href="/">Story</a></li>
                  <li><a className="text-made-gray" href="/account">Account</a></li>
              </ul>
            </div>
            <div className = "icons flex flex-row items-center gap-4">
              <span>
                <ShoppingCart size={24} color="#FFFFFF" />
              </span>
              <span>
                <User size={24} color="#FFFFFF" />
              </span>

            </div>
        </nav>
    </header>
  )
}