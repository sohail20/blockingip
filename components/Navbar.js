import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/demo">Demo</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
