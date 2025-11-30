function CardActions({ children, className }) { 
  return (
    <div className={`${className}`}> 
      {children}
    </div>
  );
};

export default CardActions;
