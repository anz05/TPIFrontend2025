function Card({ children, className }) {
  return (
    <div className={`bg-white border border-gray-300 p-2 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

export default Card;
