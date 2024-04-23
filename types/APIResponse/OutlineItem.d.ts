export interface IOutlineItem {
  id: string;
  seoObjectType: string;
  seoInfos?: Array<ISEOInfo>;
  name: string;
  hasVirtualParent: boolean;
}
