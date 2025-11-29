import React from 'react';
import CardTitle from './CardTitle';
import CardContent from './CardContent';
import CardActions from './CardActions';
import Card from './Card';

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
    <Card className={`${className}`} {...rest}> 
      {title && <CardTitle className={titleClassName}>{title}</CardTitle> } 
      <CardContent className={contentClassName}>{content}</CardContent>
      {actions && <CardActions className={actionsClassName}>{actions}</CardActions>}
    </Card>
  );
};

export default StructuredCard;
