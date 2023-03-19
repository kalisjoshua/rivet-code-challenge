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
      {list.map((rep, i) => (
        <ProfileShort
          key={`${i}-${rep.first_name}-${rep.last_name}`}
          onClick={(event: React.SyntheticEvent) => {
            event.preventDefault();
            global.history.pushState(
              {},
              "",
              event.currentTarget.getAttribute("href")
            );

            client.GET<Profile>(`/profile/${rep.id}`).then((data) => {
              data.id = data.id.toString();
              rep.id = rep.id.toString();

              if (serialize(rep) !== serialize(data)) {
                updateList(true);

                // console.log("API version of the resource is different.");
                // console.log(
                //   "\nlocal\n",
                //   serialize(rep),
                //   "\nremote\n",
                //   serialize(data)
                // );
              }

              setSelected(rep.id);
            });
          }}
          rep={rep}
          selected={rep.id.toString() === selected}
        />
      ))}
    </>
  );
}

export { Nav };
