import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";

Vue.config.productionTip = false;

Vue.use(require("vue-chartist"), {
  messageNoData: "Данных нет",
  classNoData: "empty"
});

new Vue({
  router,
  store,
  vuetify,

  render: h => h(App)
}).$mount("#app");
