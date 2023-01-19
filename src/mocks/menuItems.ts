import { MenuItems } from "../ModelTyping/Menu";

export const menuItemsMock: Array<MenuItems> = [
  {
    id: "categories",
    url: "/categorias",
    title: "Todas as categorias"
  },
  {
    id: "1",
    url: "/produtos?tipo=1",
    title: "Produtos em promoção"
  },
  {
    id: "2",
    url: "/produtos?tipo=2",
    title: "Momentos"
  }
];
