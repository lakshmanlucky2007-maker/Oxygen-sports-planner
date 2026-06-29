import React, { useState, useEffect } from 'react';
import { getInitialsAvatar } from '../utils/avatarTemplates';

export default function UserAvatar({ user, avatarUrl, name, className = "w-8 h-8 rounded-full border border-slate-200" }) {
  const targetAvatar = user ? user.avatar : avatarUrl;
  const targetName = user ? user.name : (name || 'User');

  const [imgSrc, setImgSrc] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (targetAvatar) {
      setImgSrc(targetAvatar);
    } else {
      setImgSrc(getInitialsAvatar(targetName));
    }
    setHasError(false);
  }, [targetAvatar, targetName]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getInitialsAvatar(targetName));
    }
  };

  return (
    <img
      src={imgSrc}
      alt={targetName}
      onError={handleError}
      className={`${className} object-cover`}
    />
  );
}
