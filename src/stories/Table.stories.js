import React, { createRef, Fragment, useEffect, useState } from "react";
import VariableTable from "../components/VariableTable";
import { Modal } from "antd";
import styled from "styled-components";
import { action } from "@storybook/addon-actions";
import "antd/lib/modal/style/index.css";

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
  // rawData:[],
  stickyBodyClassName: "left-sticky-body",
  bodyClassName: "right-sticky-body",
  headerClassName: "right-sticky-header",
  stickyHeaderClassName: "left-sticky-header",
};
CustomClassExample.storyName = "自定义样式";

// 5. 延缓加载
export const SkeletonExample = Template.bind({});
SkeletonExample.args = {
  header: false,
  width: 800,
  height: 400,
  columns: columnsList.map((key, index) => ({ title: key, dataIndex: key, width: 140, fixed: index < 3, render: renderCell })),
  rawData: new Array(1000).fill(null).map((v, index) => {
    let row = { id: `${index}` };

    columnsList.forEach((key) => (row[key] = `${index}_${key}`));

    return row;
  }),
  placeholder: ({ columnIndex, rowIndex }) => "--",
  useIsScrolling: true,
  useStickyIsScrolling: true,
};
SkeletonExample.storyName = "延缓加载";

// 6. 初始化偏移[偏移量]
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
InitialOffsetExample.storyName = "初始化偏移[偏移量]";

// 7. 初始化偏移[index]
export const InitialIndexOffsetExample = Template.bind({});
InitialIndexOffsetExample.args = {
  header: false,
  width: 800,
  height: 400,
  columns: columnsList.map((key, index) => ({ title: key, dataIndex: key, width: 140 })),
  rawData: new Array(1000).fill(null).map((v, index) => {
    let row = { id: `${index}` };

    columnsList.forEach((key) => (row[key] = `${index}_${key}`));

    return row;
  }),
  initialScrollRowIndex: (flatRawData) => 100,
  initialScrollColumnIndex: (columns) => 10,
};
InitialIndexOffsetExample.storyName = "初始化偏移[index]";

// 8. 滚动到指定项目
let ScrollGridRef = createRef();
export const ScrollExample = () => (
  <Fragment>
    <div>
      <button
        onClick={() => {
          ScrollGridRef.current.grid.scrollToItem({
            align: "start",
            rowIndex: 100,
          });
        }}
      >
        跳转至 行:100
      </button>
      <button
        onClick={() => {
          ScrollGridRef.current.grid.scrollToItem({
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

// 9 排序
export const SortExample = Template.bind({});
SortExample.args = {
  header: true,
  width: 800,
  height: 400,
  columns: columnsList.map((key) => ({
    title: renderHeaderCell,
    dataIndex: key,
    width: 140,
    sorter: !["a", "b"].includes(key),
    sortOrder: key === "c" ? "descend" : undefined,
  })),
  rawData: new Array(50).fill(null).map((v, index) => {
    let row = { id: `${index}` };

    columnsList.forEach((key) => (row[key] = `${index}_${key}`));

    return row;
  }),
  onChange: action("sort change"),
};
SortExample.storyName = "排序";

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

// 10. 多层分组
export const MultiGroupExample = TemplateWithContainer.bind({});
MultiGroupExample.args = {
  header: true,
  width: 800,
  height: 400,
  columns: columnsList.map((key, index) => ({ title: renderHeaderCell, dataIndex: key, width: 140, fixed: index < 3, render: renderCell })),
  rawData: new Array(3).fill(null).map((groupValue, groupIndex) => {
    const group = { id: groupIndex, children: [] };

    group.children = new Array(5).fill(null).map((cgroupValue, cgroupIndex) => {
      let cgroup = { id: `${groupIndex}-${cgroupIndex}`, children: [] };

      cgroup.children = new Array(10).fill(null).map((value, index) => {
        let row = { id: `${groupIndex}-${cgroupIndex}-${index}` };

        columnsList.forEach((key) => (row[key] = `${groupIndex}_${cgroupIndex}_${index}_${key}`));

        return row;
      });

      return cgroup;
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
MultiGroupExample.storyName = "多层分组";

// 11. 列宽调整
export const ResizeColumnExample = Template.bind({});
ResizeColumnExample.args = {
  header: true,
  width: 800,
  height: 400,
  columns: columnsList.map((key) => ({ title: renderHeaderCell, dataIndex: key, width: 140, resizer: ["a", "b"].includes(key) })),
  rawData: new Array(50).fill(null).map((v, index) => {
    let row = { id: `${index}` };

    columnsList.forEach((key) => (row[key] = `${index}_${key}`));

    return row;
  }),
  onChange: action("column width change"),
};
ResizeColumnExample.storyName = "列宽调整";

// 12. 位置调整
export const RepositionColumnExample = Template.bind({});
RepositionColumnExample.args = {
  header: true,
  width: 800,
  height: 400,
  columns: columnsList.map((key) => ({
    title: renderHeaderCell,
    dataIndex: key,
    width: 60,
    reposition: ["a", "b", "c", "d", "e"].includes(key),
  })),
  rawData: new Array(50).fill(null).map((v, index) => {
    let row = { id: `${index}` };

    columnsList.forEach((key) => (row[key] = `${index}_${key}`));

    return row;
  }),
  onChange: action("position change"),
};
RepositionColumnExample.storyName = "位置调整";

// 13. bug test
export const BugTest = () => {
  const [columns, setColumns] = useState(
    columnsList.map((key) => ({ title: renderHeaderCell, dataIndex: key, width: 140, resizer: ["a", "b"].includes(key), sorter:true, reposition:true }))
  );

  // useEffect(() => {
  //   setTimeout(() => {
  //     Modal.info({
  //       title: "This is a notification message",
  //       content: (
  //         <div>
  //           <p>some messages...some messages...</p>
  //           <p>some messages...some messages...</p>
  //         </div>
  //       ),
  //       onOk() {},
  //       keyboard: true,
  //     });
  //   }, 10000),
  //     [];
  // });

  return (
    <Container>
      <VariableTable
        header={true}
        width={800}
        height={400}
        columns={columns}
        rawData={new Array(50).fill(null).map((v, index) => {
          let row = { id: `${index}` };

          columnsList.forEach((key) => (row[key] = `${index}_${key}`));

          return row;
        })}
        onChange={({ sorter, columnSize, columnPosition, action }) => {
          if (action === "sort") {
            setColumns(sorter.columns);
          } else if (action === "resizeColumn") {
            setColumns(columnSize.columns);
          } else {
            setColumns(columnPosition.columns);
          }
        }}
      />
    </Container>
  );
};
BugTest.storyName = "Bug测试";
