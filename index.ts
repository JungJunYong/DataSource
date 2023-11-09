import Api from "./src/api/index";
import DataSource from "./src/datasource/DataSource";

export default {
  Api,
  ProxyList: DataSource,
}

window.Api = Api;
window.DataAource = DataSource;

declare global {
  interface Window {
    Api: typeof Api;
    DataAource: typeof DataSource;
  }
}