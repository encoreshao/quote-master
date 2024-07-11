import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ActionIconProps {
  icon: IconDefinition;
  onClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  className: string;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
}

const ActionIcon: React.FC<ActionIconProps> = ({ icon, onClick, className, onMouseOver, onMouseOut }) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      onClick={onClick}
      className={className}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    />
  );
};

export default ActionIcon;
