import logo from '../assets/logo.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow py-4">
        <div className="container mx-auto flex justify-center">
          <img src={logo} alt="Chat App" className="h-12" />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">{children}</main>
    </div>
  );
};

export default AuthLayout;