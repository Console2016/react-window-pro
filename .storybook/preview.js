export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      order: ["Introduction", "Components", ["Table"]],
    },
    // storySort: (a, b) => a - b,
  },
};
