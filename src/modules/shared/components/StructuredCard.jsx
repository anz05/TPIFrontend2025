import React from 'react';
import Card from './Card';
import ResponsiveText from './ResponsiveText';

function StructuredCard({ 
    title, 
    content, 
    actions, 
    className, 
    titleClassName, 
    contentClassName, 
    actionsClassName,
    ...rest 
}) {
  return (
    <Card className={className} {...rest}> 

      {title && (
        <ResponsiveText as="h2" className={titleClassName}>
          {title}
        </ResponsiveText>
      )}

      <ResponsiveText as="div" className={contentClassName}>
        {content}
      </ResponsiveText>

      {actions && (
        <ResponsiveText as="div" className={actionsClassName}>
          {actions}
        </ResponsiveText>
      )}

    </Card>
  );
};

export default StructuredCard;
