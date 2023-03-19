import "./ClientToken.css";

const TOKEN_KEY = "rivet-rep-roster-review-token";

const getToken = (): string => localStorage.getItem(TOKEN_KEY) || "";

type Props = {
  setToken: Function;
  token: string | undefined;
};

function ClientToken({ setToken, token }: Props) {
  const onChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    localStorage.setItem(TOKEN_KEY, value);
    setToken(value);
  };

  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="ClientToken" name="ClientToken" onSubmit={onSubmit}>
      <input onChange={onChange} placeholder="API Client Token" value={token} />
    </form>
  );
}

export { ClientToken, getToken };
