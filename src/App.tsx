import { useEffect, useState } from "react";

import { About } from "./component/About";
import { ClientToken } from "./component/ClientToken";
import { Nav } from "./component/Nav";
import { ProfileFullView } from "./component/ProfileFullView";
import { emptyProfile, Profile } from "./type/Profile";
import { formSubmitFactory } from "./util/profileSubmit";
import { clientFactory } from "./util/naiveSDK";

import "./App.css";

type AppProps = { repId: string | undefined; root: string; token: string };

function App({ repId, root, token: storedToken }: AppProps) {
  const [list, setList] = useState<Array<Profile>>([]);
  const [selected, setSelected] = useState<string | undefined>(repId);
  const [showNav, setShowNav] = useState(false);
  const [token, setToken] = useState<string>(storedToken || "");

  const active =
    selected === "new"
      ? ({ ...structuredClone(emptyProfile), id: "new" } as Profile)
      : list.filter((rep) => rep.id.toString() === selected).at(0);
  const client = clientFactory(root, token);
  const updateList = (forceUpdate = false) => {
    const up = (s: string) => s.toUpperCase();

    client
      .GET<Array<Profile>>("/profiles", {}, forceUpdate)
      .then((l) => {
        setShowNav(true);

        return setList(
          // sort the list - a-z - before storing it
          l.sort(({ last_name: a }, { last_name: b }) =>
            up(a) > up(b) ? 1 : up(a) < up(b) ? -1 : 0
          )
        );
      })
      .catch((e) => {
        setShowNav(false);
      });
  };

  useEffect(() => {
    window.addEventListener("popstate", (event) => {
      console.log(event?.state?.id);
      setSelected(event?.state?.id);
    });
  });

  useEffect(() => {
    if (token) {
      updateList();
    } else {
      setShowNav(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <a href="/">Rivet Rep Roster Review</a>
        </h1>

        {showNav && (
          <div className="create-new">
            <a
              href="?id=new"
              onClick={(event: React.SyntheticEvent) => {
                event.preventDefault();
                global.history.pushState(
                  { id: "new" },
                  "",
                  event.currentTarget.getAttribute("href")
                );
                setSelected("new");
              }}
            >
              Add Rep
            </a>
          </div>
        )}
      </header>

      <nav className="App-nav">
        {showNav ? (
          <Nav {...{ client, list, selected, setSelected, updateList }} />
        ) : (
          <div className="help">
            <p>
              To use this app you will need to provide a valid API token in the
              text input at the bottom of the page.
            </p>
          </div>
        )}
      </nav>

      <main className="App-main">
        {active ? (
          <ProfileFullView
            formSubmit={formSubmitFactory(client, updateList)}
            rep={active}
          />
        ) : (
          <About />
        )}
      </main>

      <footer className="App-footer">
        <div className="credit">
          <p>
            Created by{" "}
            <a href="https://kalisjoshua.me" target="__blank">
              Josh Kalis
            </a>
          </p>
        </div>

        <ClientToken {...{ setToken, token }} />
      </footer>
    </div>
  );
}

export default App;
