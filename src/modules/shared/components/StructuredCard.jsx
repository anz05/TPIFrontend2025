import React from 'react';
import Card from './Card';
import ResponsiveText from './ResponsiveText';

function StructuredCard({ title, content, actions, className, titleClassName, contentClassName, actionsClassName, ...rest }) {
  return (
    <Card className={className} {...rest}> 

      <div className="flex justify-between items-center mb-2">
        <ResponsiveText as="h2" className={`text-2xl font-semibold ${titleClassName || ""}`}>
          {title}
        </ResponsiveText>

        {actions && (
          <div className={`ml-3 ${actionsClassName || ""}`}>
            {actions}
          </div>
        )}
      </div>

      {/* Contenido debajo */}
      <div className={`mb-3 ${contentClassName || ""}`}>
        {content}
      </div>

    </Card>
  );
};

export default StructuredCard;
