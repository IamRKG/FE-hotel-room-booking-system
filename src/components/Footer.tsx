import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-orange-900 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Pathayam. All rights reserved.</p>
        <div className="mt-2">
          <a href="/privacy" className="hover:text-blue-300 mr-4">Privacy Policy</a>
          <a href="/terms" className="hover:text-blue-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;