import { MouseEventHandler } from "react";

import { Profile } from "../type/Profile";

import "./ProfileShort.css";

type ProfileShortProps = {
  onClick: MouseEventHandler<HTMLAnchorElement>;
  rep: Profile;
  selected: boolean;
};

const fallbackIMG = "https://picsum.photos/id/63/200/200";

function ProfileShort({ onClick, rep, selected }: ProfileShortProps) {
  const name = `${rep.first_name} ${rep.last_name}`;
  const alt = `${name} photo`;

  return (
    <figure className="ProfileShort" data-selected={selected}>
      <img src={rep.photo || fallbackIMG} alt={alt} />

      <figcaption>
        <div>
          <strong>{name}</strong>
          <address>
            {rep.city}, {rep.state}
          </address>
        </div>

        <footer>
          <a className="View" href={`?id=${rep.id}`} onClick={onClick}>
            View
          </a>
        </footer>
      </figcaption>
    </figure>
  );
}

export { ProfileShort };
