import { CSSProperties, memo } from "react";
import { IRawItem, TGroupRender } from "./interfaces";

interface IProps {
  style: CSSProperties;
  data: IRawItem;
  groupRender: TGroupRender;
}

const Component = ({ style, data, groupRender }: IProps) => {
  return groupRender({ data, style: { ...style, position: "absolute" } });
};

export default memo(Component);
