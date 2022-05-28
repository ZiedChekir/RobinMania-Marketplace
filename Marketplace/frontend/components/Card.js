import Link from "next/link";

const CardItem = (props) => {
  return (
    <article className="card">
      <Link href={props.link} className="card-details">
        <div>
          <img
            src={props.image}
            loading="lazy"
            className="w-full h-48 rounded-tl-md rounded-tr-md"
          />
          <div className="card-header"></div>
          <div className="card-footer">
            <h3>{props.title}</h3>
            <p>{props.description}</p>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default CardItem;
