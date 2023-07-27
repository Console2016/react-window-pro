import React from "react";
import VariableMatrix from "../components/VariableMatrix";
// import { useSize } from "./common/useSize";
import styled from "styled-components";
import randomColor from "./common/randomColor";
import mock_1 from "./mock/1.json";
import mock_2 from "./mock/2.json";
import mock_4 from "./mock/4.json";
// import { MatrixData1 } from "./dummyData";

const Component = {
  component: VariableMatrix,
  title: "Components/Matrix",
};

export default Component;

const Template = (args) => <VariableMatrix {...args} />;

// 0. Default
export const Default = Template.bind({});
Default.args = {
  width: 1218,
  height: 716,
  cellHeight: 53.47,
  cellWidth: 267.35,
  rawData: new Array(60).fill(null).map((value, index) => ({ id: index })),
};

// 1. 分组
export const GroupExample = Template.bind({});
GroupExample.args = {
  width: 800,
  height: 400,
  cellHeight: 80,
  cellWidth: 200,
  rawData: new Array(3).fill(null).map((groupValue, groupIndex) => {
    const group = { id: groupIndex, children: [] };

    group.children = new Array(100).fill(null).map((value, index) => {
      let cell = { id: `${index}` };
      return cell;
    });

    return group;
  }),
};
GroupExample.storyName = "分组";

// 2. 多层分组
export const MultiGroupExample = Template.bind({});
const Group = styled.div`
  height: 100%;
  border: 1px solid;
`;
MultiGroupExample.args = {
  width: 1500,
  height: 400,
  cellHeight: 80,
  cellWidth: 200,
  rawData: new Array(3).fill(null).map((groupValue, groupIndex) => {
    const group = { id: groupIndex, children: [] };

    group.children = new Array(5).fill(null).map((cgroupValue, cgroupIndex) => {
      const cgroup = { id: `${groupIndex}-${cgroupIndex}`, children: [] };

      cgroup.children = new Array(100).fill(null).map((value, index) => {
        const cell = { id: `${groupIndex}-${cgroupIndex}-${index}` };
        return cell;
      });

      return cgroup;
    });

    return group;
  }),
};
MultiGroupExample.storyName = "多层分组";

// 3. 自定义样式
export const CustomClassExample = Template.bind({});
const CellContainer = styled.div`
  padding: 5px;
  height: -webkit-fill-available;
`;
const Cell = styled.div`
  height: 100%;
  color: white;
  font-size: 14px;
  box-shadow: 0px 0px 5px #060b13;
  border: 1px solid;
  box-sizing: border-box;
  display: flex;
`;
const Left = styled.div`
  width: 20%;
  padding: 5px;
  background-color: #122232;
`;
const Right = styled.div`
  flex: 1;
  padding: 5px;
  background-color: #1a344f;
`;

CustomClassExample.args = {
  width: 1500,
  height: 400,
  cellHeight: 80,
  cellWidth: 200,
  rawData: new Array(100).fill(null).map((value, index) => ({ id: index })),
  cellRender: ({ rowIndex, columnIndex, data, style }) => (
    <CellContainer>
      <Cell>
        <Left></Left>
        <Right>{data.id}</Right>
      </Cell>
    </CellContainer>
  ),
};
CustomClassExample.storyName = "自定义样式";

// 4. 自定义分组头样式
export const CustomGroupRowClassExample = Template.bind({});
const GroupRowContainer = styled.div`
  padding: 5px;
  height: -webkit-fill-available;
`;
const GroupRow = styled.div`
  height: 100%;
  color: blue;
  font-size: 18px;
  border: 1px solid #1fb3b9;
  background-color: #23425f;
  box-shadow: 0px 0px 2px rgb(0 0 0 / 30%);
  box-sizing: border-box;
`;
CustomGroupRowClassExample.args = {
  width: 1500,
  height: 400,
  cellHeight: 80,
  cellWidth: 200,
  rawData: mock_1,
  groupRender: ({ style }) => {
    return (
      <div style={{ ...style, backgroundColor: randomColor() }}>
        <Group />
      </div>
    );
  },
  cellRender: ({ rowIndex, columnIndex, data, style }) => (
    <CellContainer>
      <Cell>
        <Left></Left>
        <Right>{data.id}</Right>
      </Cell>
    </CellContainer>
  ),
  groupRowRender: ({ rowIndex, columnIndex, data, style }) => (
    <GroupRowContainer>
      <GroupRow>{data.id}</GroupRow>
    </GroupRowContainer>
  ),
};

CustomGroupRowClassExample.storyName = "自定义分组头样式";

// 5. 自定义分组样式
export const CustomGroupClassExample = Template.bind({});
CustomGroupClassExample.args = {
  width: 1500,
  height: 400,
  cellHeight: 80,
  cellWidth: 200,
  rawData: mock_2,
  groupRender: ({ style }) => {
    return (
      <div style={{ ...style, backgroundColor: randomColor() }}>
        <Group />
      </div>
    );
  },
  cellRender: ({ rowIndex, columnIndex, data, style }) => (
    <CellContainer>
      <Cell>
        <Left></Left>
        <Right>{data.id}</Right>
      </Cell>
    </CellContainer>
  ),
  groupRowRender: ({ rowIndex, columnIndex, data, style }) => (
    <GroupRowContainer>
      <GroupRow>{data.id}</GroupRow>
    </GroupRowContainer>
  ),
};

CustomGroupClassExample.storyName = "自定义分组样式";

// 5. 骨架优化
export const SkeletonExample = Template.bind({});
SkeletonExample.args = {
  width: 1500,
  height: 400,
  cellHeight: 80,
  cellWidth: 200,
  rawData: new Array(3).fill(null).map((groupValue, groupIndex) => {
    const group = { id: groupIndex, children: [] };

    group.children = new Array(5).fill(null).map((cgroupValue, cgroupIndex) => {
      const cgroup = { id: `${groupIndex}-${cgroupIndex}`, children: [] };

      cgroup.children = new Array(100).fill(null).map((value, index) => {
        const cell = { id: `${groupIndex}-${cgroupIndex}-${index}` };
        return cell;
      });

      return cgroup;
    });

    return group;
  }),
  cellRender: ({ rowIndex, columnIndex, data, style }) => (
    <CellContainer>
      <Cell>
        <Left></Left>
        <Right>{data.id}</Right>
      </Cell>
    </CellContainer>
  ),
  groupRowRender: ({ rowIndex, columnIndex, data, style }) => (
    <GroupRowContainer>
      <GroupRow>{data.id}</GroupRow>
    </GroupRowContainer>
  ),
  useIsScrolling: true,
  // placeholder:'--'
  placeholder: ({ rowIndex, columnIndex, data }) => {
    const isGroup = data.children;

    if (isGroup) {
      return (
        <GroupRowContainer>
          <GroupRow>--</GroupRow>
        </GroupRowContainer>
      );
    }

    return (
      <CellContainer>
        <Cell>
          <Left></Left>
          <Right>--</Right>
        </Cell>
      </CellContainer>
    );
  },
};
SkeletonExample.storyName = "骨架优化";

// 6. 等分
const AutoEqualTemplate = ({ width, height, columnCount, ...args }) => {
  // 需要减去scrollbarSize 组件默认是20
  const cellWidth = Math.floor((width - 20) / columnCount);
  return <VariableMatrix {...args} height={height} width={width} cellWidth={cellWidth} />;
};

export const AutoEqual = AutoEqualTemplate.bind({});
AutoEqual.args = {
  width: 1400,
  height: 400,
  columnCount: 10,
  cellHeight: 80,
  rawData: new Array(3).fill(null).map((groupValue, groupIndex) => {
    const group = { id: groupIndex, children: [] };

    group.children = new Array(5).fill(null).map((cgroupValue, cgroupIndex) => {
      const cgroup = { id: `${groupIndex}-${cgroupIndex}`, children: [] };

      cgroup.children = new Array(100).fill(null).map((value, index) => {
        const cell = { id: `${groupIndex}-${cgroupIndex}-${index}` };
        return cell;
      });

      return cgroup;
    });

    return group;
  }),
  cellRender: ({ rowIndex, columnIndex, data, style }) => (
    <CellContainer>
      <Cell>
        <Left></Left>
        <Right>{data.id}</Right>
      </Cell>
    </CellContainer>
  ),
  groupRowRender: ({ rowIndex, columnIndex, data, style }) => (
    <GroupRowContainer>
      <GroupRow>{data.id}</GroupRow>
    </GroupRowContainer>
  ),
};

AutoEqual.storyName = "等分";

// 4. 初始化偏移
export const InitialOffsetExample = Template.bind({});
InitialOffsetExample.args = {
  width: 800,
  height: 400,
  cellHeight: 80,
  cellWidth: 200,
  rawData: new Array(200).fill(null).map((value, index) => ({ id: index })),
  initialScrollTop: 50,
};
InitialOffsetExample.storyName = "初始化偏移";

// 5. 滚动到指定项目
