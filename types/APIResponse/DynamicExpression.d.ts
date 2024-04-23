interface IAvailableChildren {
  id: string;
  availableChildren: Array<string>;
  children: Array<string>;
}
interface IChildren {
  id: string;
  availableChildren: Array<string>;
  children: Array<string>;
}
interface IDynamicExpression {
  all: boolean;
  not: boolean;
  id: string;
  availableChildren: Array<IAvailableChildren>;
  children: Array<IChildren>;
}
