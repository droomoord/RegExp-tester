const infoBox = ({ description }) => {
  return (
    <div className="info-box" onClick={(e) => e.stopPropagation()}>
      <p>{description}</p>
    </div>
  );
};

export default infoBox;
