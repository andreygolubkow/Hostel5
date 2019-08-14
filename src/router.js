import Vue from 'vue'
import Router from 'vue-router'
import Index from "./views/Index";
import Office from "./views/Office/Office";
import Peoples from "./views/Office/Peoples/Peoples";
import PeoplesListView from "./views/Office/Peoples/PeoplesListView";
import PeopleView from "./views/Office/Peoples/PeopleView";
import PeoplesImport from "./views/Office/Peoples/PeoplesImport";
import Rooms from "./views/Office/Rooms/Rooms";
import RoomsListView from "./views/Office/Rooms/RoomsListView";
import RoomView from "./views/Office/Rooms/RoomView";

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
          path: 'rooms',
          component: Rooms,
          children: [
            {
              path: "",
              redirect: "list"
            },
            {
              path: "list",
              component: RoomsListView
            },
            {
              path: ":id",
              component: RoomView
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
