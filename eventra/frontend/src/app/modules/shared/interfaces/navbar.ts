export interface NavbarItem {
  title: string;
  url: string;
  icon: string;
}

export interface NavbarSection {
  title: string;
  items: NavbarItem[];
}
