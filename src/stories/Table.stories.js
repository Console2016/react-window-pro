import React, { createRef, Fragment } from "react";
import VariableTable from "../components/VariableTable";
import styled from "styled-components";

const Component = {
  component: VariableTable,
  title: "Components/Table",
};

export default Component;

const Template = (args) => <VariableTable {...args} />;
const TemplateWithContainer = (args) => (
  <Container>
    <VariableTable {...args} />
  </Container>
);

const columnsList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w"];

// 1. 1000条数据
export const Default = Template.bind({});
Default.args = {
  header: true,
  width: 800,
  height: 400,
  columns: columnsList.map((key) => ({ title: key, dataIndex: key, width: 140 })),
  rawData: new Array(1000).fill(null).map((v, index) => {
    let row = { id: `${index}` };

    columnsList.forEach((key) => (row[key] = `${index}_${key}`));

    return row;
  }),
};

// 2. 无列头
export const ColumnsExample = Template.bind({});
ColumnsExample.args = {
  header: false,
  width: 800,
  height: 400,
  columns: columnsList.map((key) => ({ title: key, dataIndex: key, width: 140 })),
  rawData: new Array(1000).fill(null).map((v, index) => {
    let row = { id: `${index}` };

    columnsList.forEach((key) => (row[key] = `${index}_${key}`));

    return row;
  }),
};
ColumnsExample.storyName = "无列头";

// 3. 冻结列
export const StickyColumnsExample = Template.bind({});
StickyColumnsExample.args = {
  header: false,
  width: 800,
  height: 400,
  columns: columnsList.map((key, index) => ({ title: key, dataIndex: key, width: 140, fixed: index < 3 })),
  rawData: new Array(1000).fill(null).map((v, index) => {
    let row = { id: `${index}` };

    columnsList.forEach((key) => (row[key] = `${index}_${key}`));

    return row;
  }),
};
StickyColumnsExample.storyName = "冻结列";

// 4. 自定义样式
const Container = styled.div`
  height: 100%;
  width: 100%;

  .left-sticky-body {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  }

  .right-sticky-body {
    color: red;
  }
  .left-sticky-header {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  }
  .right-sticky-header {
    color: yellow;
  }
`;
export const CustomClassExample = TemplateWithContainer.bind({});
const Cell = styled.div`
  padding: 5px;
  background-color: ${(props) => (props.rowIndex % 2 === 0 ? "#0c1d31" : "#0d293f")};
  border-bottom: 1px solid ${(props) => (props.rowIndex % 2 === 0 ? "#0c1d31" : "#0d293f")};
  color: white;
  text-align: center;
  font-size: 14px;
  box-shadow: inset 0 1px 0 1px rgba(255, 255, 255, 0.04);
`;
const renderCell = ({ columnIndex, rowIndex, dataIndex, value, record }) => {
  return <Cell rowIndex={rowIndex}>{value}</Cell>;
};

const HeaderCell = styled.div`
  padding: 5px;
  background-color: #0f3854;
  border-bottom: 1px solid #2c5d77;
  border-right: 1px solid #2c5d77;
  color: white;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const renderHeaderCell = ({ dataIndex }) => {
  return <HeaderCell>{dataIndex}</HeaderCell>;
};

CustomClassExample.args = {
  header: true,
  width: 800,
  height: 400,
  columns: columnsList.map((key, index) => ({ title: renderHeaderCell, dataIndex: key, width: 140, fixed: index < 3, render: renderCell })),
  rawData: new Array(100).fill(null).map((v, index) => {
    let row = { id: `${index}` };

    columnsList.forEach((key) => (row[key] = `${index}_${key}`));

    return row;
  }),
  stickyBodyClassName: "left-sticky-body",
  bodyClassName: "right-sticky-body",
  headerClassName: "right-sticky-header",
  stickyHeaderClassName: "left-sticky-header",
};
CustomClassExample.storyName = "自定义样式";

// 5. 骨架优化
export const SkeletonExample = Template.bind({});
SkeletonExample.args = {
  header: false,
  width: 800,
  height: 400,
  columns: columnsList.map((key, index) => ({ title: key, dataIndex: key, width: 140, fixed: index < 3 })),
  rawData: new Array(1000).fill(null).map((v, index) => {
    let row = { id: `${index}` };

    columnsList.forEach((key) => (row[key] = `${index}_${key}`));

    return row;
  }),
  placeholder: ({ columnIndex, rowIndex }) => "--",
  useIsScrolling: true,
  useStickyIsScrolling: true,
};
SkeletonExample.storyName = "骨架优化";

// 6. 初始化偏移(TODO)
export const InitialOffsetExample = Template.bind({});
InitialOffsetExample.args = {
  header: false,
  width: 800,
  height: 400,
  columns: columnsList.map((key, index) => ({ title: key, dataIndex: key, width: 140 })),
  rawData: new Array(1000).fill(null).map((v, index) => {
    let row = { id: `${index}` };

    columnsList.forEach((key) => (row[key] = `${index}_${key}`));

    return row;
  }),
  initialScrollLeft: 100,
  initialScrollTop: 1000,
};
InitialOffsetExample.storyName = "初始化偏移";

// 7. 滚动到指定项目
let ScrollGridRef = createRef();
export const ScrollExample = () => (
  <Fragment>
    <div>
      <button
        onClick={() => {
          ScrollGridRef.current.scrollToItem({
            align: "start",
            rowIndex: 100,
          });
        }}
      >
        跳转至 行:100
      </button>
      <button
        onClick={() => {
          ScrollGridRef.current.scrollToItem({
            align: "start",
            columnIndex: 10,
            rowIndex: 100,
          });
        }}
      >
        跳转至 行:100 列:10
      </button>
    </div>
    <VariableTable
      {...{
        ref: ScrollGridRef,
        outerRef: (container) => {
          console.log("container", container);
        },
        innerRef: (innerContainer) => {
          console.log("inner container", innerContainer);
        },
        header: false,
        width: 800,
        height: 400,
        columns: columnsList.map((key, index) => ({ title: key, dataIndex: key, width: 140, fixed: index < 3 })),
        rawData: new Array(1000).fill(null).map((v, index) => {
          let row = { id: `${index}` };

          columnsList.forEach((key) => (row[key] = `${index}_${key}`));

          return row;
        }),
      }}
    />
  </Fragment>
);

ScrollExample.storyName = "滚动到指定位置";

// 8. 排序
// itemKey

// 9. 分组
const GroupRow = styled.div`
    border: 1px solid #1fb3b9;
    background-color: #25516a;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
`;
export const GroupExample = TemplateWithContainer.bind({});
GroupExample.args = {
  header: true,
  width: 800,
  height: 400,
  columns: columnsList.map((key, index) => ({ title: renderHeaderCell, dataIndex: key, width: 140, fixed: index < 3, render: renderCell })),
  rawData: new Array(3).fill(null).map((groupValue, groupIndex) => {
    const group = { id: groupIndex, children: [] };

    group.children = new Array(100).fill(null).map((value, index) => {
      let row = { id: `${index}` };
      columnsList.forEach((key) => (row[key] = `${groupIndex}_${index}_${key}`));
      return row;
    });

    return group;
  }),
  groupRowRender: ({ columnIndex, data, width }) => {
    return <GroupRow>{data.id}</GroupRow>;
  },
  stickyBodyClassName: "left-sticky-body",
  bodyClassName: "right-sticky-body",
  headerClassName: "right-sticky-header",
  stickyHeaderClassName: "left-sticky-header",
};
GroupExample.storyName = "分组";
