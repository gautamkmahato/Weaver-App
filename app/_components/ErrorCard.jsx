// components/Card.js
import { Ban } from 'lucide-react';
import Link from 'next/link';


const ErrorCard = ({  message, btnText }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <Ban size={48} className="text-amber-600" />
        </div>
        
        {/* Text */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {message}
        </h2>
        
        {/* Button */}
        <Link href="/">
            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-amber-700 transition duration-300">
                {btnText}
            </button>
        </Link>
      </div>
    </div>
  );
}




export default ErrorCard;
