import { Profile } from "../type/Profile";
import { SDK } from "../util/naiveSDK";
import { serialize } from "../util/serialize";
import { ProfileShort } from "./ProfileShort";

type NavProps = {
  client: SDK;
  list: Array<Profile>;
  selected: string | undefined;
  setSelected: Function;
  updateList: Function;
};

function Nav({ client, list, selected, setSelected, updateList }: NavProps) {
  return (
    <>
      <div className="create-new">
        <a
          href="?=new"
          onClick={(event: React.SyntheticEvent) => {
            event.preventDefault();
            global.history.pushState({}, "", "?id=new");
            setSelected("new");
          }}
        >
          Add Rep
        </a>
      </div>
      {list.map((rep, i) => (
        <ProfileShort
          key={`${i}-${rep.first_name}-${rep.last_name}`}
          onClick={(event: React.SyntheticEvent) => {
            event.preventDefault();
            global.history.pushState({}, "", `?id=${rep.id}`);

            client.GET<Profile>(`/profile/${rep.id}`).then((data) => {
              data.id = "" + data.id;
              rep.id = "" + rep.id;

              if (serialize(rep) !== serialize(data)) {
                console.log("API version of the resource is different.");
                console.log(
                  "\nlocal\n",
                  serialize(rep),
                  "\nremote\n",
                  serialize(data)
                );

                updateList(true);
              }

              setSelected(rep.id);
            });
          }}
          rep={rep}
          selected={rep.id === selected}
        />
      ))}
    </>
  );
}

export { Nav };
