import clsx from 'clsx';
import React from 'react';

type AvaProps = {
    name: any;
    className?: string;
}

const Avatar = ({ name, className} : AvaProps) => {
  const firstLetter = name?.charAt(0).toUpperCase();

  return (
    <div className={clsx('bg-[#FFE6D6] text-[#F05729] font-extrabold', className)}>
      {firstLetter}
    </div>
  );
};

export default Avatar;
