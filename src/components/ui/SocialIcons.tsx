import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface SocialIconProps {
  platform: string;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = '' }) => {
  const iconClass = `w-5 h-5 ${className}`;
  
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <Facebook className={iconClass} />;
    case 'instagram':
      return <Instagram className={iconClass} />;
    case 'email':
    case 'mail':
      return <Mail className={iconClass} />;
    case 'phone':
      return <Phone className={iconClass} />;
    case 'address':
    case 'location':
      return <MapPin className={iconClass} />;
    default:
      return null;
  }
};

export default SocialIcon;