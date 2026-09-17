import React, { useState } from 'react';

export const DoctorAvatar = ({ src, name, size = 56, style = {} }) => {
  const [hasError, setHasError] = useState(false);

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name || 'Bác sĩ'}
        onError={() => setHasError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          flexShrink: 0,
          ...style
        }}
      />
    );
  }

  return (
    <div
      className="avatar-circle"
      style={{
        background: '#0D9488',
        color: '#FFF',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: size > 60 ? '24px' : '18px',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        ...style
      }}
    >
      {name ? name.charAt(0) : 'B'}
    </div>
  );
};

export default DoctorAvatar;
