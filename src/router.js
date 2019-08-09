import Vue from 'vue'
import Router from 'vue-router'
import Index from "./views/Index";
import Office from "./views/Office/Office";
import Peoples from "./views/Office/Peoples/Peoples";
import PeoplesListView from "./views/Office/Peoples/PeoplesListView";
import PeopleView from "./views/Office/Peoples/PeopleView";
import PeoplesImport from "./views/Office/Peoples/PeoplesImport";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '',
      component: Index
    },
    {
      path: '/office/',
      component: Office,
      children: [
        {
          path: "index",
          component: () => import("./views/Office/Index.vue")
        },
        {
          path: 'peoples',
          component: Peoples,
          children: [
            {
              path: "",
              redirect: "list"
            },
            {
              path: "list",
              component: PeoplesListView
            },
            {
              path: "import",
              component: PeoplesImport
            },
            {
              path: ":id",
              component: PeopleView
            }
          ]
        },
        {
          path: "",
          redirect: "index"
        }
      ]
    }
  ]
})
