import DataSource from "./src/datasource/DataSource";

export default {
  DataSource: DataSource,
}

window.DataSource = DataSource;

declare global {
  interface Window {
    DataSource: typeof DataSource;
  }
}