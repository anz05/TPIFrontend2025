function CardTitle({ children, className }) {
  return (
    <div className={`${className}`}> 
      <h1 className="text-2xl font-bold">
        {children}
      </h1>
    </div>
  );
};

export default CardTitle;
