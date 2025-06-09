import React from "react";
import { MdSubdirectoryArrowRight } from "react-icons/md";


interface MoreDetailsCardProps {
  children: React.ReactNode;
  className?: string;
  href: string;
  linkText?: string;
}

const MoreDetailsCard: React.FC<MoreDetailsCardProps> = ({ children, href, linkText = "查看更多详情", className }) => {
  return (
    <div
      className={` rounded-xl transition-colors duration-200 group w-full ${className} relative hover:-translate-y-0.5`}
      style={{ transition: 'background 0.2s, transform 0.2s' }}
    >
      <div>{children}</div>
      <div className="flex items-center select-none  absolute right-0">
        <MdSubdirectoryArrowRight className="text-lg text-gray-400 group-hover:text-blue-500 transition-transform duration-200 group-hover:translate-x-1 mb-2" />
        <a
          href={href}
          className="ml-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline group-hover:text-blue-500 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </a>
      </div>
    </div>
  );
};

export default MoreDetailsCard; 