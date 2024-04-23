const Rating = ({ value, range = 5, info = '' }: { value: number; range?: number; info?: string }) => {
  return (
    <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
      <div className="text-muted fs-16">
        {Array.from({ length: range }).map((x, indx) => (
          <span key={'rate-' + indx} className={`mdi mdi-star text-${indx < value ? 'warning' : 'muted'}`}></span>
        ))}
      </div>
      {info && <div className="text-muted">{info}</div>}
    </div>
  );
};
export default Rating;
