const emptyProfile: Partial<Profile> = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  photo: "",
  notes: "",
};

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  photo: string;
  notes: string;
};

export type { Profile };
export { emptyProfile };
