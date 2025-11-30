import React from 'react';
import Card from './Card';
import ResponsiveText from './ResponsiveText';

function StructuredCard({ title, content, actions, className, titleClassName, contentClassName, actionsClassName, ...rest }) {
  return (
    <Card className={className} {...rest}> 

      {title && (
        <ResponsiveText as="h2" className={`text-lg font-semibold mb-2 ${titleClassName || ""}`}>
          {title}
        </ResponsiveText>
      )}

      <div className={`mb-3 ${contentClassName || ""}`}>
        {content}
      </div>

      {actions && (
        <ResponsiveText as="div" className={`mt-3 ${actionsClassName || ""}`}>
          {actions}
        </ResponsiveText>
      )}

    </Card>
  );
};

export default StructuredCard;
